import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

const contactsSlice = createSlice({
  name: 'contacts',
  initialState: {
    contact: [],
    loading: false,
    error: null,
    currentContact: null
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setContacts: (state, action) => {
      state.contact = action.payload;

    },
    setCurrentContact: (state, action) => {
      state.currentContact = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    addContact: (state, action) => {
      state.contact.push(action.payload);
    },
    updateContact: (state, action) => {
      const index = state.contact.findIndex(contact => contact.id === action.payload.id);
      if (index !== -1) {
        state.contact[index] = action.payload;
      }
    }, clearContacts: (state) => {
        state.contact = [];
        state.currentContact = null;
      },
      removeContact: (state, action) => {
        state.contact = state.contact.filter(contact => contact.id !== action.payload);
      },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const {
  setLoading,
  clearContacts,
  setContacts,
  setCurrentContact,
  setError,
  addContact,
  updateContact,
  removeContact,
  clearError
} = contactsSlice.actions;


export const fetchContacts = (userId) => async (dispatch, getState) => {
    try {
     const token = getState().user.token;
      dispatch(setLoading(true));
      const response = await axios.get(`/contacts/${userId}`, {
        headers: {
          //  'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
       withCredentials:true

      });



      let contactsData = response.data;
      dispatch(setContacts(contactsData));

    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Ошибка загрузки контактов'));
    }
  };
export const updateContactData = (id, contactData) => async (dispatch, getState) => {
    try {
        const token = getState().user.token;
      dispatch(setLoading(true));
      const response = await axios.put(`/contacts/${id}`, contactData, {
        headers: {
         //   'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },

        withCredentials:true

      });
      dispatch(updateContact(response.data));
      return response.data;
    } catch (error) {
      dispatch(setError(error.response?.data || 'Ошибка обновления контакта'));
      throw error;
    }
  };

export const deleteContact = (id) => async (dispatch, getState) => {
  try {
    const token = getState().user.token;
    dispatch(setLoading(true));
    const response = await axios.delete(`/contacts/${id}`, {
      headers: {
       // 'Authorization': `Bearer ${token}`,
        'Content-Type':'application/json',
        'Accept': 'application/json',
      },
      withCredentials: true
    });
    dispatch(removeContact(id));
  }
  catch (error)
   {
    dispatch(setError(error.response?.data || 'Ошибка удаления контакта'));
    throw error;
  }
};

export const createContact = (contactData) => async (dispatch, getState) => {
    try {
      const token = getState().user.token;
      dispatch(setLoading(true));
      const response = await axios.post('/contacts', contactData, {
        headers: {
       //   'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });


      dispatch(addContact(response.data.data));
      return response.data;
    } catch (error) {
      const errorData = error.response?.data;
      dispatch(setError(errorData?.message || errorData || 'Ошибка создания контакта'));
      throw error;
    }
  };

const ContactPersistConfig = {
    key: 'contacts',
    storage,
    stateReconciler: autoMergeLevel2,
    whitelist: ['contact','currentContact'],
    blacklist: ['loading', 'error', ]
};

export const persistedContactReducer =
persistReducer(ContactPersistConfig, contactsSlice.reducer);

export default contactsSlice.reducer;