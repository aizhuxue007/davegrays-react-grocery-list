import Header from './Header';
import SearchItem from './SearchItem';
import AddItem from './AddItem';
import Content from './Content';
import Footer from './Footer';
import apiRequest from './apiRequest';
import { useState, useEffect } from 'react';

function App() {
  const API_URL = 'http://localhost:3500/items';

  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [search, setSearch] = useState('');
  const [fetchError, setFetchError] = useState(null);
  const [loadingItems, setLoadingItems] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const resp = await fetch(API_URL);
        if (!resp.ok) throw new Error("data was not received correctly");
        let listItems = await resp.json()
        setItems(listItems)
        setFetchError(null)
      } catch (e) {
        setFetchError(true)
      } finally {
        setLoadingItems(false)
      }
    }
    setTimeout(() => {
      fetchItems()
    }, 2000)
  }, [])

  const makeReqObj = (item, method) => {
    const reqObj = {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item)
    }
    return reqObj
  }

  const makeRequestAndHandleError = async (url, reqObj) => {
    const result = await apiRequest(url, reqObj)
    if (result) setFetchError(result)
  }

  const addItem = async (item) => {
    const id = items.length ? items[items.length - 1].id + 1 : 1;
    const myNewItem = { id, checked: false, item };
    const listItems = [...items, myNewItem];
    setItems(listItems);
    
    makeRequestAndHandleError(API_URL, makeReqObj(myNewItem, 'POST'))
  }

  const handleCheck = async (id) => {
    const listItems = items.map((item) => item.id === id ? { ...item, checked: !item.checked } : item);
    setItems(listItems);

    const selectedItem = listItems.filter((item) => item.id === id)
    const patchedItem = { checked: selectedItem[0].checked }
    makeRequestAndHandleError(makeReqUrlWithId(id), makeReqObj(patchedItem, 'PATCH'))
  }

  const makeReqUrlWithId = (id) => {
    return `${API_URL}/${id}`
  }

  const handleDelete = async (id) => {
    const listItems = items.filter((item) => item.id !== id);
    setItems(listItems);

    const deleteOptions = { method: 'DELETE' }
    await makeRequestAndHandleError(makeReqUrlWithId(id), deleteOptions)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newItem) return;
    addItem(newItem);
    setNewItem('');
  }

  return (
    <div className="App">
      <Header title="Grocery List" />
      <AddItem
        newItem={newItem}
        setNewItem={setNewItem}
        handleSubmit={handleSubmit}
      />
      <SearchItem
        search={search}
        setSearch={setSearch}
      />
      <Content
        items={items.filter(item => ((item.item).toLowerCase()).includes(search.toLowerCase()))}
        handleCheck={handleCheck}
        handleDelete={handleDelete}
        fetchError={fetchError}
        loadingItems={loadingItems}
      />
      <Footer length={items.length} />
    </div>
  );
}

export default App;
