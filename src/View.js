import hh from 'hyperscript-helpers';
import { h } from 'virtual-dom';
import * as R from 'ramda';
import { 
  showFormMsg,
  bookInputMsg,
  priceInputMsg,
  saveBookMsg,
  deleteBookMsg,
  editBookMsg,
} from './Update';

const {
  pre,
  div,
  h1,
  button,
  form,
  label,
  input,
  table,
  thead,
  tbody,
  tr,
  th,
  td,
  i,
} = hh(h);

function cell(tag, className, value) {
  return tag({ className }, value);
}

const tableHeader = thead([
  tr([
    cell(th, 'pa2 tl', 'Book'),
    cell(th, 'pa2 tr', 'Price'),
    cell(th, '', ''),
  ]),
]);

function bookRow(dispatch, className, book) {
  return tr({ className }, [
    cell(td, 'pa2', book.title),
    cell(td, 'pa2 tr', book.price),
    cell(td, 'pa2 tr', [
      i({
        className: 'ph1 fa fa-trash-o pointer',
        onclick: () => dispatch(deleteBookMsg(book.id)),
      }),
      i({
        className: 'ph1 fa fa-pencil-square-o pointer',
        onclick: () => dispatch(editBookMsg(book.id)),
      }),
    ]),
  ]);
}

function totalRow(books) {
  const total = R.pipe(
    R.map( book => book.price ), 
    R.sum,
  )(books);
  return tr({ className: 'bt b' }, [
    cell(td, 'pa2 tr', 'Total:'),
    cell(td, 'pa2 tr', total),
    cell(td, '', ''),
  ]);
}

function booksBody(dispatch, className, books) {
  const rows = R.map(
    R.partial(bookRow, [dispatch, 'stripe-dark']), 
    books);

  const rowsWithTotal = [...rows, totalRow(books)];
  
  return tbody({ className }, rowsWithTotal);
}

function tableView(dispatch, books) {
  if (books.length === 0) {
    return div({ className: 'mv2 i black-50' }, 'No books to display...');
  }
  return table({ className: 'mv2 w-100 collapse' }, [
    tableHeader,
    booksBody(dispatch, '', books),
  ]);
}

function fieldSet(labelText, inputValue, oninput) {
  return div([
    label({ className: 'db mb1' }, labelText),
    input({
      className: 'pa2 input-reset ba w-100 mb2',
      type: 'text',
      value: inputValue,
      oninput
    }),
  ]);
}

function buttonSet(dispatch) {
  return div([
    button(
      {
        className: 'f3 pv2 ph3 bg-blue white bn mr2 dim',
        type: 'submit',
      },
      'Save',
    ),
    button(
      {
        className: 'f3 pv2 ph3 bn bg-light-gray dim',
        type: 'button',
        onclick: () => dispatch(showFormMsg(false)),
      },
      'Cancel',
    ),
  ]);
}

function formView(dispatch, model) {
  const { title, price, showForm } = model;
  if (showForm) {
    return form(
      {
        className: 'w-100 mv2',
        onsubmit: e => {
          e.preventDefault();
          dispatch(saveBookMsg);
        },
      },
      [
        fieldSet('book', title,
          e => dispatch(bookInputMsg(e.target.value))
        ),
        fieldSet('price', price || '',
          e => dispatch(priceInputMsg(e.target.value))
        ),
        buttonSet(dispatch),
      ],
    );
  }
  return button( 
      { 
        className: 'f3 pv2 ph3 bg-blue white bn',
        onclick: () => dispatch(showFormMsg(true)),
      },
      'Add book',
    );
}

function view(dispatch, model) {
  return div({ className: 'mw6 center' }, [
    h1({ className: 'f2 pv2 bb' }, 'List of Books'),
    formView(dispatch, model),
    tableView(dispatch, model.books)
  ]);
}

export default view;