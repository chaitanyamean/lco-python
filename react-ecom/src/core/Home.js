import React, {useState, useEffect} from 'react';

import {getProducts} from './helper/coreapicalls';
import ImageHelper from './helper/imageHelper';
import Base from './Base';
import Card from './Card';
import "../styles.css";

const Home = () => {
    const [products, setProducts] = useState([])
    const [error, setErrors] = useState([])

    const loadAllProducts = () => {
        getProducts()
        .then(data => {
            if(data.error) {
                setErrors(data.error)
                console.log(data.error)
            } else {
                setProducts(data)
            }
        })
        .catch(err => console.log(err))
    }

    useEffect(() => {
        loadAllProducts();
    }, [])

    return (
            <Base title="Home Page" description="Welcome to Tshirt store">
            <div className="row">
            {products.map((item,idx) => {
                return (
                    <div key = {idx} className="col-4 mb-4">
                    <Card product={item}/>
                    </div>
                )
            })}

            </div>
            </Base>
    );
};

export default Home;

