from django.urls import path
from django.views.decorators.cache import cache_page

from haystack.forms import ModelSearchForm
from haystack.query import SearchQuerySet
from haystack.views import SearchView

from . import views

app_name = "blog"

urlpatterns = [
    # 博客首页
    path(r'', views.IndexView.as_view(), name='index'),
    # 博客首页分页
    path(r'page/<int:page>/', views.IndexView.as_view(), name='index_page'),

    path(r'article/<int:year>/<int:month>/<int:day>/<int:article_id>.html',
         views.ArticleDetailView.as_view(),
         name='detailbyid'),
    path(r'article/<int:article_id>/update', views.ArticleDetailUpdateView.as_view(), name='ajax_article_detail_update'),
    path(r'category/<slug:category_name>.html', views.CategoryDetailView.as_view(), name='category_detail'),
    path(r'category/<slug:category_name>/<int:page>.html', views.CategoryDetailView.as_view(),
         name='category_detail_page'),

    path(r'author/<author_name>.html', views.AuthorDetailView.as_view(), name='author_detail'),
    path(r'author/<author_name>/<int:page>.html', views.AuthorDetailView.as_view(),
         name='author_detail_page'),

    path(r'tag/<slug:tag_name>.html', views.TagDetailView.as_view(), name='tag_detail'),
    path(r'tag/<slug:tag_name>/<int:page>.html', views.TagDetailView.as_view(), name='tag_detail_page'),
    path('archives.html', views.ArchivesView.as_view(), name='archives'),
    path('links.html', views.LinkListView.as_view(), name='links'),
    path(r'upload', views.fileupload, name='upload'),
    path(r'refresh', views.refresh_memcache, name='refresh')

]
