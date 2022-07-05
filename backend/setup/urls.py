from django.urls import path, include, re_path
from django.views.generic import TemplateView
from rest_framework import routers
from movie import views as movieViews

router = routers.DefaultRouter()
router.register("movies", movieViews.MovieViewSet)
router.register("genres", movieViews.GenreViewSet)
router.register("keywords", movieViews.KeywordViewSet)
router.register(
    "recommendations", movieViews.RecommendationViewSet, basename="recommendations"
)

urlpatterns = [
    path("auth/", include("djoser.urls")),
    path("auth/", include("djoser.urls.jwt")),
    path("api/", include(router.urls)),
]

urlpatterns += [re_path(r"^.*", TemplateView.as_view(template_name="index.html"))]
