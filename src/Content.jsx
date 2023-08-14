import ItemList from './ItemList';

const Content = ({ items, handleCheck, handleDelete, fetchError, loadingItems }) => {
    return (
        <main>
            {fetchError && (<p style={{ color: 'red' }}>Problem fetching data...</p>)}
            
            {loadingItems && (<p style={{ color: 'blue' }}>Loading items...</p>)}

            {!(items.length===0) && (
                <ItemList
                    items={items}
                    handleCheck={handleCheck}
                    handleDelete={handleDelete}
                />
            )}

            {(!fetchError && !items.length && !loadingItems) && (<p style={{ marginTop: '2rem' }}>Your list is empty.</p>)}  
        </main>
    )
}

export default Content
