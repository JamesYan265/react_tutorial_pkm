import { useEffect, useState } from 'react';
import './App.css';
import Card from './components/Card/Card';
import Navbar from './components/Navbar/Navbar';
import { getAllPokemon, getPokemon } from './utils/pokemon';

function App() {
  const initialURL = "https://pokeapi.co/api/v2/pokemon";
  const [loading, setLoading] = useState(true);
  const [pkmData, setPkmData] = useState([]);
  const [nextURL, setNextURL] = useState("");
  const [prevURL, setPrevURL] = useState("");

  // Promise.all 係[等*所有map, array]實現時回傳一個Promise物件
  const PokemonDetail = async (data) => {
    let _pokemonData = await Promise.all(
      data.map((pokemon) => {
        let pokemonRecord = getPokemon(pokemon.url);
        return pokemonRecord;
      })
    );
    setPkmData(_pokemonData);
  };

  useEffect(() => {
    const fetchPokemonData = async() => {
      //取得資料
      let res = await getAllPokemon(initialURL);
      //各隻Pokemon資料取得
      //取得再詳細的Data 
      PokemonDetail(res.results);
      setNextURL(res.next);
      setPrevURL(res.previous);
      setLoading(false);
    };
    fetchPokemonData();
  },[])

  const handlePrevPage = async() => {
    if(!prevURL) return;

    setLoading(true);
    let data = await getAllPokemon(prevURL);
    await PokemonDetail(data.results);
    setPrevURL(data.previous);
    setLoading(false);
  };

  const handleNextPage = async() => {
    setLoading(true);
    let data = await getAllPokemon(nextURL);
    await PokemonDetail(data.results);
    setNextURL(data.next);
    setPrevURL(data.previous);
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className='App'>
        {loading ? (
          <h1>讀取中</h1>
        ) : (
          <>
            <div className='pokemonCardContariner'>
              {pkmData.map((pokemon, index) => {
                return <Card key={index} pokemon={pokemon}/>
              })}
            </div>
            <div className='btn'>
              <button onClick={handlePrevPage}>前一頁</button>
              <button onClick={handleNextPage}>後一頁</button>
            </div>          
          </>

        )}
      </div>
    </>
  )
}

export default App;
