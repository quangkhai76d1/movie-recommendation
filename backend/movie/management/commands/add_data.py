from django.core.management.base import BaseCommand
import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.dialects import postgresql


class Command(BaseCommand):
    help = "Add data from csv files to the database"

    def handle(self, *args, **options):

        engine = create_engine(
            "postgresql://postgres:khang123@localhost:5432/movies_recommendation"
        )

        movies = pd.read_csv("data/movies.csv")
        movies.to_sql(
            "movie_movie",
            con=engine,
            if_exists="append",
            index=False,
            dtype={
                "id": postgresql.VARCHAR(),
                "title": postgresql.VARCHAR(),
                "original_language": postgresql.VARCHAR(),
                "overview": postgresql.TEXT(),
                "release_date": postgresql.DATE(),
                "popularity": postgresql.FLOAT(),
                "runtime": postgresql.INTEGER(),
                "tagline": postgresql.VARCHAR(),
                "vote_count": postgresql.INTEGER(),
                "rating": postgresql.FLOAT(),
            },
        )

        genres = pd.read_csv("data/genres.csv")
        genres.to_sql(
            "movie_genre",
            con=engine,
            if_exists="append",
            index=False,
            dtype={
                "id": postgresql.VARCHAR(),
                "name": postgresql.VARCHAR(),
            },
        )

        genres_movies = pd.read_csv("data/movies_genres.csv")
        genres_movies.to_sql(
            "movie_movie_genres",
            con=engine,
            if_exists="append",
            index=False,
            dtype={
                "id": postgresql.VARCHAR(),
                "movie_id": postgresql.VARCHAR(),
                "genre_id": postgresql.VARCHAR(),
            },
        )

        keywords = pd.read_csv("data/keywords.csv")
        keywords.to_sql(
            "movie_keyword",
            con=engine,
            if_exists="append",
            index=False,
            dtype={
                "id": postgresql.VARCHAR(),
                "name": postgresql.VARCHAR(),
            },
        )

        keywords_movies = pd.read_csv("data/movies_keywords.csv")
        keywords_movies.to_sql(
            "movie_movie_keywords",
            con=engine,
            if_exists="append",
            index=False,
            dtype={
                "id": postgresql.VARCHAR(),
                "movie_id": postgresql.VARCHAR(),
                "keyword_id": postgresql.VARCHAR(),
            },
        )

        similar_movies = pd.read_csv("data/similar_movies.csv")
        similar_movies.to_sql(
            "movie_similarity", con=engine, if_exists="append", index=False
        )
