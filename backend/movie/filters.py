from django_filters import rest_framework as filters
from .models import Movie, Keyword, Genre


class MovieFilter(filters.FilterSet):
    release_year = filters.CharFilter(field_name="release_date", lookup_expr="year")
    genre = filters.CharFilter(field_name="genres__name", lookup_expr="iexact")
    keyword = filters.CharFilter(field_name="keywords__key", lookup_expr="iexact")
    rating = filters.NumberFilter(field_name="rating", lookup_expr="gte")
    title = filters.CharFilter(field_name="title", lookup_expr="icontains")
    orderby = filters.OrderingFilter(
        fields=(
            ("rating", "rating"),
            ("release_date", "release"),
            ("vote_count", "vote"),
            ("popularity", "popularity"),
        )
    )

    class Meta:
        model = Movie
        fields = []


class GenreFilter(filters.FilterSet):
    class Meta:
        model = Genre
        fields = {"name": ["iexact", "icontains"]}


class KeywordFilter(filters.FilterSet):
    class Meta:
        model = Keyword
        fields = {"key": ["iexact", "icontains"]}
