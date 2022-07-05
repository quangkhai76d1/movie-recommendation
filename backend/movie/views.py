from rest_framework.decorators import action, schema
from rest_framework.views import APIView
from .models import Genre, Keyword, Movie, MovieRating
from .serializers import (
    KeywordSerializer,
    MovieSerializer,
    GenreSerializer,
    RatingSerializer,
)
from .filters import MovieFilter, GenreFilter, KeywordFilter
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .pagination import MoviePagination
from accounts.models import UserAccount
from rest_framework import status
from django.db.models import Q
from pyspark.sql import SparkSession, functions as f, Row
from pyspark.ml.recommendation import ALS

spark = SparkSession.builder.appName("movieRecommendation").getOrCreate()

db_df = spark.createDataFrame(
    data=[
        Row(**i)
        for i in MovieRating.objects.all().values("movie_id", "user_id", "rating")
    ],
    schema=["movieId", "userId", "rating"],
)

top_movie_df = spark.read.csv(
    "data/top_movie/ratings.csv",
    inferSchema=True,
    header=True,
).join(db_df, ["userId"], "leftanti")


als = ALS(
    userCol="userId",
    itemCol="movieId",
    ratingCol="rating",
    coldStartStrategy="drop",
    nonnegative=True,
    maxIter=5,
    regParam=0.1,
    implicitPrefs=False,
    rank=5,
)

als_model = als.fit(top_movie_df.unionByName(db_df))

recommendations = (
    als_model.recommendForAllUsers(8)
    .withColumn("rec_exp", f.explode("recommendations"))
    .select("userId", "rec_exp.movieId", "rec_exp.rating")
)


class MovieViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    filterset_class = MovieFilter
    pagination_class = MoviePagination

    @action(detail=True, url_path="similarities")
    def get_similar_movies(self, request, pk=None):
        movies = self.get_object().similarities.all().order_by("-rating")

        serializer = MovieSerializer(movies, many=True)

        return Response(serializer.data)

    @action(
        detail=True,
        url_path="ratings",
        methods=["post"],
        permission_classes=[IsAuthenticated],
    )
    def add_rating(self, request, pk=None):
        user = UserAccount.objects.get(id=request.user.id)
        movie = self.get_object()
        rating = request.data["rating"]

        if MovieRating.objects.filter(Q(user=user) & Q(movie=movie)).exists():
            return Response(
                "You have been rated this movie!", status=status.HTTP_400_BAD_REQUEST
            )

        movie.add_rating(user, rating)

        return Response(status=status.HTTP_200_OK)

    @action(
        detail=True,
        url_path="is-rated",
        permission_classes=[IsAuthenticated],
    )
    def is_rated(self, request, pk=None):
        userId = request.user.id
        rating = MovieRating.objects.filter(
            Q(user__id=userId) & Q(movie__id=pk)
        ).first()

        if rating:
            return Response(
                {"is_rated": True, "rating": rating.rating}, status=status.HTTP_200_OK
            )

        return Response({"is_rated": False}, status=status.HTTP_200_OK)

    @action(
        detail=False,
        url_path="ratings",
        methods=["get"],
        permission_classes=[IsAuthenticated],
    )
    def get_ratings(self, request, pk=None):
        user = UserAccount.objects.get(id=request.user.id)
        ratings = MovieRating.objects.filter(user=user)
        serializers = RatingSerializer(ratings, many=True)

        return Response(serializers.data, status=status.HTTP_200_OK)


class RecommendationViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        userId = request.user.id
        exists = MovieRating.objects.filter(user__id=userId).exists()

        if exists:
            movieIds = [
                row.movieId
                for row in recommendations.filter(f"userId == {userId}").collect()
            ]

            movies = Movie.objects.filter(pk__in=movieIds)
            serializers = MovieSerializer(movies, many=True)

            return Response(serializers.data, status=status.HTTP_200_OK)

        return Response("Not found your ratings", status=status.HTTP_400_BAD_REQUEST)


class GenreViewSet(viewsets.ReadOnlyModelViewSet):
    authentication_classes = []
    permission_classes = []
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer
    filterset_class = GenreFilter


class KeywordViewSet(viewsets.ReadOnlyModelViewSet):
    authentication_classes = []
    permission_classes = []
    queryset = Keyword.objects.all()
    serializer_class = KeywordSerializer
    filterset_class = KeywordFilter
