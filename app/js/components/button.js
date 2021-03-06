import m from 'mithril'

export default function button(name, onclick, text = 'Submit', isLoading = false) {
  const noop = () => {};
  const loadingImg = m('img', { src: 'app/images/loading-bubbles.gif' });
  return m(`.${name}-btn-container`,
    m('button', {
      onclick: isLoading ? noop : onclick
    }, isLoading ? loadingImg : text)
  );
}
