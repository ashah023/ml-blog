import m from 'mithril';
import stream from 'mithril/stream';
import Nav from './components/nav';
import inputBox from './components/inputBox';
import textArea from './components/textArea';
import button from './components/button';
import LoadingView from './components/loading_view';

export default function NewBlog({ api }) {

  const blogTitle = stream('');
  const blogContent = stream('');
  const apiError = stream('');
  const isEditingBlog = stream(false);
  const isLoadingBlog = stream(false);
  const isNewBlogLoading = stream(false);

  const createBlog = () => {
    apiError('');
    isNewBlogLoading(true);

    api.createBlog({ title: blogTitle(), content: blogContent() })
    .then(res => {
      if (!res.success) throw res.errMsg;
      isNewBlogLoading(false);
      m.route.set('/home');
    })
    .catch(err => { apiError(err); isNewBlogLoading(false); m.redraw(); });
  };

  const updateBlog = () => {
    apiError('');
    isNewBlogLoading(true);

    const blogId = m.route.param('id');
    api.editBlog({ blogId, title: blogTitle(), content: blogContent() })
    .then(res => {
      if (!res.success) throw res.errMsg;
      isNewBlogLoading(false);
      m.route.set('/blogs?id=' + blogId);
    })
    .catch(err => { apiError(err); isNewBlogLoading(false); m.redraw(); });
  };

  const loadBlog = blogId => {
    isLoadingBlog(true); isEditingBlog(true);

    api.blogs('?id=' + blogId)
    .then(res => {
      if (!res.success) throw res.errMsg;

      const { title, content } = res.data;
      blogTitle(title);
      blogContent(content);
      isLoadingBlog(false);
      m.redraw();
    })
    .catch(err => { apiError(err); isLoadingBlog(false); m.redraw(); })
  };

  const nav = Nav({ api });

  const pageView = () => m('.page-view', [
    m('.title', 'Create A New Blog'),
    m('.error', apiError()),
    inputBox('blog-title', blogTitle),
    textArea('blog-content', blogContent),
    button('new-blog', isEditingBlog() ? updateBlog : createBlog, 'Save Blog',isNewBlogLoading())
  ]);

  const oncreate = () => {
    blogTitle(''); blogContent(''); apiError(''); m.redraw();
    isNewBlogLoading(false);

    const blogId = m.route.param('id');
    if (blogId) loadBlog(blogId);
  };

  const view = () => m('.new-blog', [
    m(nav),
    isLoadingBlog() ? LoadingView() : pageView()
  ]);

  return { oncreate, view };
}
