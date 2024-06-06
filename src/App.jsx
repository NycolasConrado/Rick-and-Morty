import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

function App() {
  const [count, setCount] = useState(1);
  const [character, setCharacter] = useState(null);
  const [searchId, setSearchId] = useState('');
  const [episodes, setEpisodes] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    console.log("Fetching character...");
    fetchCharacter();
  }, [count]);

  useEffect(() => {
    if (character && character.episode) {
      fetchEpisodes(character.episode);
    }
  }, [character]);

  const fetchCharacter = async () => {
    try {
      console.log(`Fetching character with ID: ${count}`);
      const response = await fetch(`https://rickandmortyapi.com/api/character/${count}`);

      if (!response.ok) {
        throw new Error('Personagem não encontrado!');
      }

      const data = await response.json();
      console.log("Character data:", data);
      setCharacter(data);
      setError(false);
      setSearchId(count.toString()); 
    } catch (error) {
      console.log('Error fetching character:', error);
      setCharacter(null);
      setError(true);
      toast.error('Personagem não encontrado!');
    }
  };

  const fetchEpisodes = async (episodeUrls) => {
    try {
      const episodesData = await Promise.all(episodeUrls.map(async url => {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Erro ao buscar episódio');
        const data = await response.json();
        return { number: data.id, name: data.name };
      }));
      setEpisodes(episodesData);
    } catch (error) {
      console.log('Erro ao buscar episódios:', error);
      setEpisodes([]);
    }
  };

  const handleSearchChange = (event) => {
    setSearchId(event.target.value);
  };

  const handleSearch = () => {
    const id = parseInt(searchId);
    if (!isNaN(id)) {
      setCount(id);
    } else {
      console.log('ID inválido:', searchId);
      toast.error('ID de personagem inválido!');
    }
  };

  const handlePrevious = () => {
    const newCount = count - 1;
    setCount(newCount);
    setSearchId(newCount.toString()); 
  };

  const handleNext = () => {
    const newCount = count + 1;
    setCount(newCount);
    setSearchId(newCount.toString()); 
  };

  return (
    <div className='container'>
      <div className='personagens'>
        <div className="center">
          <div className="caracter">
            {character && (
              <div className="Statdus">
                <div className="row">
                  <div className="quardar">
                    <h2>{character.name}</h2>
                    <p><strong>STATUS:</strong><strong> {character.status}</strong></p>
                    <p><strong>ESPÉCIES:</strong><strong> {character.species}</strong></p>
                    <p><strong>GÊNERO:</strong><strong> {character.gender}</strong></p>
                    <p><strong>ORIGEM:</strong><strong> {character.origin.name}</strong></p>
                    <p><strong>LOCALIDADE:</strong><strong> {character.location.name}</strong></p>
                    <p><strong>CRIADA:</strong><strong> {character.created}</strong></p>
                  </div>
                  <div className="quardar">
                    <img src={character.image} alt={character.name} className="imagem"/>
                  </div>
                  <div className="quardar">
                    <div className="episodios">
                      <h3>Episódios:</h3>
                      <ul className="lista-ep">
                        {episodes.map((episode, index) => (
                          <li key={index} className="lista-group-item">{`Episódio ${episode.number}: ${episode.name}`}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="search-container">
              <div className="search-label">Digite um ID:</div>
              <input
                type="number"
                id="search-input"
                className="form-control search-input"
                value={searchId}
                onChange={handleSearchChange}
              />
              <button className="ir" onClick={handleSearch}>Ir</button>
            </div>
            <div className='buttons'>
              <button className="Beck" onClick={handlePrevious}>&lt; Anterior</button>
              <button className="Next" onClick={handleNext}>Próximo &gt;</button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer className="erro"/>
    </div>
  );
}

export default App;
