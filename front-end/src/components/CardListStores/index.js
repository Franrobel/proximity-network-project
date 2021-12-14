import React, { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import "./CardListStores.css"
import CardStore from '../CardStore'
import iconTienda from '../../assets/img/stores-list-banner/icon-tienda.svg'
import iconError from '../../assets/img/menssage-error/error.png'
// importar el contexto
import { Context } from '../../context/SearchContext.js'

const CardListStores = () => {

    const searchValueGlobal = useContext(Context);

    // Estado necesario para la reactividad del componente.
    const [searchGlobal, setSearchGlobal] = useState(searchValueGlobal[0])

    const [stores, setStores] = useState([]);
    const [message, setMessage] = useState("")

    useEffect(() => {
        const getData = () => {
            fetch(`http://localhost:4000/search/${searchGlobal}`)
                .then(response => response.json())
                .then(data => {


                    setStores(data);

                    console.log("fetched", data);
                })
                .catch(error => {
                    console.log(error);
                });
        };
        try {

            getData();
        } catch (error) {
            console.log(error)
        }
    }, [searchGlobal]);

    const alert = <div className={`${stores.message || stores.length == 0 ? 'd-block' : 'd-none'} col-lg-12 text-center `} >
        {searchGlobal}
        <div><img src={iconError} alt="icon-error" className="img-fluid" /></div>
        <p className='parrafo-error'>Opps!.. {stores.message}</p>
    </div>

    return (
        <section id="cardListStore">
            <div className="section-header d-flex justify-content-center align-items-baseline text-center">
                <img src={iconTienda} alt="" />
                <h1>Stores List</h1>
            </div>
            <div className="container">
                <div className="row card-list-content">
                    {
                        alert
                    }
                    <div className="col-lg-8 col-xl-6">

                        {
                            stores.length > 0 && stores.map((cardInfo) => <CardStore cardInfo={cardInfo} />)
                        }
                    </div>
                    {
                        stores.length > 0 && <div className="col-lg-4 col-xl-6">
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2991.775370888872!2d2.1821435156713362!3d41.422394601786664!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a4bd2a9d40d745%3A0x393b26cc3dfc5b5a!2sCarrer%20de%20Felip%20II%2C%20Barcelona!5e0!3m2!1ses!2ses!4v1638973289824!5m2!1ses!2ses" width="100%" height="100%" style={{ border: "0" }} allowfullscreen="" loading="lazy"></iframe>
                        </div>

                    }

                </div>
            </div>
        </section>
    )
}

export default CardListStores;
