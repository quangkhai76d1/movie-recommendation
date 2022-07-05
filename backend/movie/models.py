from django.db import models
from accounts.models import UserAccount


class Genre(models.Model):
    name = models.CharField(max_length=40)

    def __str__(self):
        return self.name


class Keyword(models.Model):
    key = models.CharField(max_length=50)

    def __str__(self):
        return self.key


class Movie(models.Model):
    title = models.CharField(max_length=255, blank=True)
    genres = models.ManyToManyField(Genre, related_name="movies")
    keywords = models.ManyToManyField(Keyword, related_name="movies")
    similarities = models.ManyToManyField(
        "self",
        through="Similarity",
        symmetrical=False,
        related_name="similar_to+",
    )
    user_ratings = models.ManyToManyField(UserAccount, through="MovieRating")
    original_language = models.CharField(null=True, max_length=10)
    overview = models.TextField(null=True, blank=True)
    release_date = models.DateField(null=True)
    popularity = models.FloatField()
    runtime = models.IntegerField(null=True)
    tagline = models.CharField(max_length=255, blank=True, null=True)
    vote_count = models.IntegerField(null=True)
    rating = models.FloatField(null=True)

    def add_rating(self, user, rating):
        movie_rating, created = MovieRating.objects.get_or_create(
            movie=self, user=user, rating=rating
        )

        return movie_rating

    def remove_rating(self, user):
        MovieRating.objects.filter(user=user, movie=self).delete()
        return

    def get_ratings_by_user(self, user):
        return self.user_ratings.filter(movie=self, user=user)

    def __str__(self):
        return self.title


class Similarity(models.Model):
    from_movie = models.ForeignKey(
        Movie, related_name="from_movie", on_delete=models.CASCADE
    )
    to_movie = models.ForeignKey(
        Movie, related_name="to_movie", on_delete=models.CASCADE
    )
    sim_cos = models.FloatField()


class MovieRating(models.Model):
    movie = models.ForeignKey(
        Movie, related_name="movie_ratings", on_delete=models.CASCADE
    )
    user = models.ForeignKey(
        UserAccount, related_name="movie_ratings", on_delete=models.CASCADE
    )
    rating = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
