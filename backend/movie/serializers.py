from movie.models import Genre, Keyword, Movie, MovieRating
from rest_framework import serializers


class MovieSerializer(serializers.ModelSerializer):
    genres = serializers.StringRelatedField(many=True)
    keywords = serializers.StringRelatedField(many=True)

    class Meta:
        model = Movie
        fields = [
            "id",
            "title",
            "genres",
            "keywords",
            "original_language",
            "overview",
            "popularity",
            "release_date",
            "runtime",
            "tagline",
            "vote_count",
            "rating",
        ]


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ["id", "name"]


class KeywordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Keyword
        fields = ["id", "key"]


class RatingSerializer(serializers.ModelSerializer):
    movie = MovieSerializer(read_only=True)

    class Meta:
        model = MovieRating
        fields = ["movie", "rating", "created_at"]
