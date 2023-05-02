import React,{useEffect, useState} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal, ModalBody, ModalHeader, ModalFooter} from 'react-bootstrap';
import {show, Button} from 'react-bootstrap';
import axios from 'axios';

const API_IMG = "https://image.tmdb.org/t/p/w500";


const API_URL = "https://api.themoviedb.org/3/movie/popular?api_key=ba16880dd0b146d3f4fa4421c6cd688d";

function App() {

  //const [show, setShow] = useState(false);
  const [show, setShow] = useState([]);


    const handleShow=()=>setShow(true);
    const handleClose=()=>setShow(false);

  const [movies, setMovies] = useState([]);

  const[insertar, setInsertar]=useState(false);
  const handleInsertar=()=>setInsertar(true);
  const handleNotInsertar=()=>setInsertar(false);

  const [form, setForm] = useState({
    id: "",
    name: "",
    cover: "",
    genre: "",
    director: "",
    summary: "",
    tipoModal: ""
  });

  const [tipoModal, setTipoModal] = useState("");


  const peticionGet = () => {
    axios.get("http://localhost:3001/movies/").then(response => {
      setMovies(response.data.data); //.data.data porque en el backend se envia un objeto con la propiedad data
    }).catch(error => {
      console.log(error);
    })
  }


  //PETICION GET
  // const fetchData = () => {
  //   fetch(API_URL)
  //   .then(res => res.json())
  //   .then(data => {
  //     console.log(data);
  //   //  console.log(data.results);

  //     setMovies(data.results);
  //     setShow(Array(data.length).fill(false));

  //     //console.log(); // add this line to see what data is being returned
  //   })
  //   .catch((err) => {
  //     console.error(err)
  //   });
  // };

  //Se usa useEffect para hacer la peticion a la API
  useEffect(() => {
    //fetchData();
    peticionGet();
    console.log(movies);

  }, []);

  //PETICION POST  
  //! DA UN ERROR CON LA BASE DE DATOS
  //para agregar una pelicula con los inputs del usuario
  const postMovie = async() => {
    await axios
      .post("http://localhost:3001/movies", form)
      .then(response => {
        handleInsertar();
        peticionGet();
      })
      .catch(error => {
        console.log(error.message);
      });
  };

  //Funcion para seleccionar pelicula metodo put
  const selectMovie = (movie) => {
    setForm({
      id: movie.id,
      name: movie.name,
      cover: movie.cover,
      genre: movie.genre,
      director: movie.director,
      summary: movie.summary,
    });
  };


  //Funcion para captar inputs del usuario
  const handleChange = (e) => {
    e.persist();
    setForm((prevForm) => ({
      ...prevForm,
      [e.target.name]: e.target.value,
    }));
    console.log(form);
  };

  const handleNewMovieClick = () => {
    setForm(null);
    setTipoModal("insertar");
    handleInsertar();
  };

  //PETICION PUT
  //!ERROR CON UN PEDO DEL ID, FORM.ID NO EXISTE PERO VER COMO SE USA EN LA DB
  const putMovie = () => {
    axios.put("http://localhost:3000/movies/" + form.id, form).then((response) => {
      handleNotInsertar();
      peticionGet();
    });
  };

  //PETICION DELETE
  const deleteMovie = (movie) => {
    axios.delete("http://localhost:3000/movies/" + form.id).then((response) => {
    peticionGet();
    });
  };



  return (
    
    <div className='container'>
      <br/>
      <button className='btn btn-success' onClick={() => { handleNewMovieClick(); handleInsertar(); }}>New Movie</button>
      <br/><br/>
      <div className='grid'>

      {console.log(movies)}
      {Array.prototype.map.call(movies, (movieReq, index) => (
        <div key={movieReq.id} className="card text-center bg-secendary mb-3">
          <div className="card-body">
            <img className="card-img-top" src={movieReq.cover} alt={movieReq.name} />
            <div className="card-body">
              <button type="button" className="btn btn-dark" onClick={() => setShow([...show.slice(0, index), true, ...show.slice(index+1)])}>View More</button>
              <button className='btn btn-success' onClick={() => {
                selectMovie(movieReq);
                handleInsertar();
                setTipoModal("");
              }}>Edit</button>
              <button type="button" className='btn btn-danger' onClick={() => deleteMovie(movieReq.id)}>Delete</button>
              <Modal show={show[index]} onHide={() => setShow([...show.slice(0, index), false, ...show.slice(index+1)])}>
                <Modal.Header closeButton>
                  <Modal.Title>{movieReq.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <img className="card-img-top" src={movieReq.cover} alt={movieReq.name} />
                  <h3>{movieReq.name}</h3>
                  <h4>Genre: {movieReq.genre}</h4>
                  <h5>Director: {movieReq.director}</h5>
                  <br></br>
                  <h6>Summary</h6>
                  <p>{movieReq.summary}</p>
                </Modal.Body>
                <Modal.Footer>
                  <Button varient="secondary" onClick={() => setShow([...show.slice(0, index), false, ...show.slice(index+1)])}>Close</Button>
                </Modal.Footer>
              </Modal>
            </div>
          </div>
        </div>
      ))}

      </div>

      <Modal show={insertar} onHide={handleNotInsertar}>
          <ModalHeader style={{display: 'block'}}>
            <span style={{float: 'right'}}>x</span>
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label htmlFor="name">ID</label>
              <input className='form-control' type="text" name="id" id="id" readOnly onChange={handleChange} value={form?form.id: movies.length+1}/>
              <label htmlFor="name">Name</label>
              <input className='form-control' type="text" name="name" id="name" onChange={handleChange} value={form?form.name: ''}/>
              <br/>
              <label htmlFor="cover">Poster path</label>
              <input className='form-control' type="text" name="cover" id="cover" onChange={handleChange} value={form?form.cover: ''}/>
              <br/>
              <label htmlFor="genre">Vote average</label>
              <input className='form-control' type="text" name="genre" id="genre" onChange={handleChange} value={form?form.genre: ''}/>
              <br/>
              <label htmlFor="director">Release date</label>
              <input className='form-control' type="text" name="director" id="director" onChange={handleChange} value={form?form.director: ''}/>
              <br/>
              <label htmlFor="summary">summary</label>
              <textarea className='form-control' type="text" name="summary" id="summary" onChange={handleChange} value={form?form.summary: ''}/>
            </div>
          </ModalBody>
          
          <ModalFooter>
            {tipoModal =='insertar'?
            <button className="btn btn-success" onClick={postMovie}>Insertar</button>:  //En esta linea poner onCLick={postMovie} cuando sirva
            <button className="btn btn-primary" onClick={putMovie}>Actualizar</button>
          }
            <button className="btn btn-danger" onClick={handleNotInsertar}>Cancelar</button>
        
          </ModalFooter>
      </Modal>
    </div>    
  );
}


export default App;
