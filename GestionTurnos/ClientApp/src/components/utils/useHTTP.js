import React, { useEffect, useState,useContext } from 'react';
import axios from "axios";
import { UserContext } from '../Context/UserContext';

const useSelect = ({url, initialState = [], params = {}}) => {
    const [data, setData] = useState(initialState);
    const [error, setError] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const {token} = useContext(UserContext);

    let config = {
        headers: {
          'Authorization': 'Bearer ' + token
        },
        params: params // Añadir params aquí
    }

    useEffect(() => {
        if(token){
        setData(initialState);
        setError(false);
        setLoading(true);
        const get = async () => {
            try {
                const {data} = await axios.get(url, config); // Pasar solo config aquí
                if(data.codigo === 103){
                    setData(data.list);
                    setLoading(false);
                    setError(true);
                }else{
                    setData(data.list.filter((dato) => dato.activo === true));
                    setLoading(false);
                }
            } catch {
                setError(true);
                setLoading(false);
            }
        };
        get();
    }}, [token]);

    return [data, isLoading, error];
};

const useGet = ({url, initialState = [], params = {}, run = {}}) => {
    const [data, setData] = useState(initialState);
    const [error, setError] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const {token} = useContext(UserContext);
    
    let config = {
        headers: {
            'Authorization': 'Bearer ' + token
        },
        params: params // Añadir params aquí
    }
    useEffect(() => {
        if (token) {
            setData(initialState);
            setError(false);
            setLoading(true);
            const get = async () => {
                try {
                    const { data } = await axios.get(url, config);
                    if (data.codigo === 103) {
                        setData(data.list);
                        setLoading(false);
                    } else {
                        setData(data.list);
                        setLoading(false);
                    }
                } catch {
                    setError(true);
                    setLoading(false);
                }
            };
            get();
        }
    }, [run,token]);
    return [data, isLoading, error];
};

const usePost = (url) => {
    const [data, setData] = useState(0);
    const [error, setError] = useState();
    const [pendingG, setPending] = useState();
    const {token} = useContext(UserContext);
    
    let config = {
        headers: {
          'Authorization': 'Bearer ' + token
        },
    }

    const executePost = async (obj) => {
        setPending(true);
        setError();
        try {
            const response = await axios.post(url, obj,config)
            setData(response.data)
            setPending(false);
            if(response.data === 101 || response.data === 102){
                setError(true);
            } else {
                setError(false);
            }
        } catch {
            setError(true);
            setPending(false);
        }
    };
    return [data, pendingG, error, executePost]
}

const usePut = (url) => {
    const [dataM, setDataM] = useState(0);
    const [errorM, setErrorM] = useState();
    const [pendingM, setPendingM] = useState();
    const {token} = useContext(UserContext);
    
    let config = {
        headers: {
          'Authorization': 'Bearer ' + token
        },
    }
    const executePut = async (obj) => {
        setPendingM(true);
        setErrorM();
        try {
            const response = await axios.put(url, obj,config)
            setDataM(response.data)
            setPendingM(false);
            if(response.data === 101 || response.data === 102){
                setErrorM(true);
            } else {
                setErrorM(false);
            }
        } catch {
            setErrorM(true);
            setPendingM(false);
        }
    };
    return [dataM, pendingM, errorM, executePut]
}

const useGetPer = (url) => {
    const [data, setData] = useState({});
    const [error, setError] = useState(false);
    const [pendingG, setPending] = useState();
    const {token} = useContext(UserContext);
    
    let config = {
        headers: {
          'Authorization': 'Bearer ' + token
        },
    }

    const executeGet = async (obj) => {
        setPending(true);
        setError();
        try {
            const response = await axios.get(url,config)
            setPending(false);
            if(response.data === 101 || response.data === 102){
                setError(true);
            } else {
                setError(false);
                setData(response.data)
            }
        } catch {
            setError(true);
            setPending(false);
        }
    };
    return [data, pendingG, error, executeGet]
}

export {useGet, usePost, usePut, useSelect,useGetPer};