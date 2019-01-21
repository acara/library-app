import * as R from 'ramda';

const actionType = {
  SHOW_FORM: 'SHOW_FORM',
  BOOK_INPUT: 'BOOK_INPUT',
  PRICE_INPUT: 'PRICE_INPUT',
  SAVE_BOOK: 'SAVE_BOOK',
  DELETE_BOOK: 'DELETE_BOOK',
  EDIT_BOOK: 'EDIT_BOOK',
};

export function showFormMsg(showForm) {
  return {
    type: actionType.SHOW_FORM,
    showForm,
  };
}

export function bookInputMsg(title) {
  return {
    type: actionType.BOOK_INPUT,
    title,
  };
}

export function priceInputMsg(price) {
  return {
    type: actionType.PRICE_INPUT,
    price,
  };
}

export const saveBookMsg = { type: actionType.SAVE_BOOK };

export function deleteBookMsg(id) {
  return {
    type: actionType.DELETE_BOOK,
    id,
  };
}

export function editBookMsg(editId) {
  return {
    type: actionType.EDIT_BOOK,
    editId,
  };
}

function update(action, model) {
  switch (action.type) {
    case actionType.SHOW_FORM: {
      const { showForm } = action;
      return { ...model, showForm, title: '', price: 0 };
    }
    case actionType.BOOK_INPUT: {
      const { title } = action;
      return { ...model, title };
    }
    case actionType.PRICE_INPUT: {
      const price = R.pipe(
        parseInt, 
        R.defaultTo(0),
      )(action.price);
      return { ...model, price };
    }
    case actionType.SAVE_BOOK: {
      const { editId } = model;
      const updatedModel = editId !== null ? 
        edit(action, model) : 
        add(action, model);
      return updatedModel;
    }
    case actionType.DELETE_BOOK: {
      const { id } = action;
      const books = R.filter(
        book => book.id !== id
      , model.books);
      return { ...model, books };
    }
    case actionType.EDIT_BOOK: {
      const { editId } = action;
      const book = R.find(
        book => book.id === editId, 
        model.books);
      
      const { title, price } = book;

      return {
        ...model, 
        editId, 
        title, 
        price,
        showForm: true, 
      };
    }
  }
  return model;
}

function add(action, model) {
  const { nextId, title, price } = model;
  const book = { id: nextId, title, price };
  const books = [...model.books, book]
  return {
    ...model,
    books,
    nextId: nextId + 1,
    title: '',
    price: 0,
    showForm: false,
  };
}

function edit(action, model) {
  const { title, price, editId } = model;
  const books = R.map(book => {
    if (book.id === editId) {
      return { ...book, title, price };
    }
    return book;
  }, model.books);
  return {
    ...model,
    books,
    title: '',
    price: 0,
    showForm: false,
    editId: null,
  };
}

export default update;