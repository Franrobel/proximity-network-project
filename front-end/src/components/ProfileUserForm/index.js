import './ProfileUserForm.css'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
const ProfileUserForm = () => {
    const validationSchema = Yup.object().shape({
        fullname: Yup.string().required('Fullname is required'),
        storeName: Yup.string().required('Store name is required'),
        description: Yup.string().required('Description is required'),
        street: Yup.string().required('Street is required'),
        postalCode: Yup.string().required('Postal code is required'),
        city: Yup.string().required('City is required'),
        country: Yup.string().required('Country is required'),
        storeCategory: Yup.string().required('Store category is required'),


    });
    const uploadStoreData = async (token, data) => {
        //const dataCargada = JSON.parse(data);
       console.log("token en upload", token);
       const dataStore = JSON.parse(data)
       console.log("data n upload", dataStore);
        const url = "http://localhost:4000/stores/profiles"
        const body = {
            fullname: dataStore.fullname,
            storeName: dataStore.storeName,
            description: dataStore.description,
            street: dataStore.street,
            postalCode: dataStore.postalCode,
            city: dataStore.city,
            country: dataStore.country,
            storeCategory: dataStore.storeCategory
        }
        const config = {
            method: 'POST',
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
                    },
            body: JSON.stringify(body)
        }
        
        try {
            const response = await fetch(url, config)
            console.log("response", response)
            const data = await response.json();
            console.log("data", data);    
            
            
        } catch {
            

        }
    
    }

    const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: yupResolver(validationSchema) });

    // Metodo onSubmit
    const onSubmit = (data) => {
        const token = localStorage.getItem('token')
        //console.log('token en upload', token);
        const datosTiendaCargada = JSON.stringify(data, null, 2);
        uploadStoreData(token, datosTiendaCargada)
    };

    return (
        <div className="container px-4 py-5 p-lg-0">
            <div className="d-flex title-content-profile">
                <Link to="/profile-user"><h2>PROFILE</h2></Link>
                <span>|</span>
                <Link to="/profile-account"><h2>ACCOUNT</h2></Link>
                <span>|</span>
                <Link to="/profile-product"><h2>YOUR PRODUCTS</h2></Link>
            </div>
            <div className='from-profile'>
                <form className="formulario-usuario" onSubmit={handleSubmit(onSubmit)}  >
                    <div className="row mb-3">
                        <label htmlFor="exampleInputName1" className="form-label col-lg-4 col-form-label">Full name<span>* </span></label>
                        <div className="col-lg-8">
                            <input type="text" name="fullname" className={`form-control  ${errors.fullname ? 'is-invalid' : ''}`} id="exampleInputName" {...register('fullname')}
                            />
                            <div className="invalid-feedback">{errors.fullname?.message}</div>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="exampleInputStoreCategory" className="form-label col-lg-4 col-form-label">Store category<span>* </span></label>
                        <div className='col-lg-8'>
                            <input type="text" name="storeCategory" className={`form-control  ${errors.storeCategory ? 'is-invalid' : ''}`} {...register('storeCategory')} id="exampleInputStoreName1" />
                            <div className="invalid-feedback">{errors.storeCategory?.message}</div>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="exampleInputImage" className="form-label col-lg-4 col-form-label">Main photo<span>* </span></label>
                        <div className="col-lg-8">
                            <div className='icon-img-form  form-control '>

                                <i className="bi bi-camera"></i>
                            </div>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="exampleInputStoreName" className="form-label col-lg-4 col-form-label">Store name<span>* </span></label>
                        <div className='col-lg-8'>
                            <input type="text" name="storeName" className={`form-control ${errors.storeName ? 'is-invalid' : ''}`} {...register('storeName')} id="exampleInputStoreName1" />
                            <div className="invalid-feedback">{errors.storeName?.message}</div>
                        </div>

                    </div>
                    <div className=" row mb-3">
                        <label htmlFor="exampleInputPDescription" className="form-label col-lg-4 col-form-label">Description<span>* </span></label>
                        <div className="form-floating col-lg-8">
                            <textarea name="description" className={`form-control text-from-description ${errors.description ? 'is-invalid' : ''}`} {...register('description')} id="floatingTextarea2" style={{ height: "120px", width: "100%" }}></textarea>
                            <div className="invalid-feedback">{errors.description?.message}</div>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="inputAddress2" className="form-label col-lg-4 col-form-label mb-2 pt-lg-0">Store address<span>* </span></label>
                        <div className="col-lg-8">
                            <div className='row'>
                                <div className="col-6 mb-3" style={{ paddingRight: "6px" }}>
                                    <input type="text" name="street" className={`form-control title-placeholder ${errors.street ? 'is-invalid' : ''}`} {...register('street')} id="exampleInputStreet1" aria-describedby="emailHelp" placeholder="street" />
                                    <div className="invalid-feedback">{errors.street?.message}</div>
                                </div>
                                <div className="col-6 mb-3" style={{ paddingLeft: "0px" }}>
                                    <input type="text" name="postalCode" className={`form-control title-placeholder ${errors.postalCode ? 'is-invalid' : ''}`} {...register('postalCode')} id="exampleInputCodePostal1" aria-describedby="emailHelp" placeholder="postal code" />
                                    <div className="invalid-feedback">{errors.postalCode?.message}</div>
                                </div>
                                <div className="col-6 " style={{ paddingRight: "6px" }}>
                                    <input type="text" name="city" className={`form-control title-placeholder ${errors.city ? 'is-invalid' : ''}`} {...register('city')} id="inputCity" aria-describedby="emailHelp" placeholder="City" />
                                    <div className="invalid-feedback">{errors.city?.message}</div>
                                </div>
                                <div className="col-6" style={{ paddingLeft: "0px" }}>
                                    <input type="text" name="country" className={`form-control title-placeholder ${errors.country ? 'is-invalid' : ''}`} {...register('country')} id="exampleInputCountry1" aria-describedby="emailHelp" placeholder="Country" />
                                    <div className="invalid-feedback">{errors.country?.message}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="exampleInputStoreWeb1" className="form-label col-lg-4 col-form-label">Store web</label>
                        <div className='col-lg-8'>
                            <input type="text" className="form-control " id="exampleInputPassword1" />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="exampleNumber1" className="form-label col-lg-4 col-form-label">Phone Number</label>
                        <div className='col-lg-8'>
                            <input type="text" className="form-control" id="exampleInputPassword1" />
                        </div>
                    </div>

                    <div className="d-flex flex-column flex-lg-row align-items-center justify-content-center gap-lg-4">
                        <button type="submit" className="btn btn-primary btn-formulario">Save</button>
                        <button type="button" onClick={() => reset()} className="btn btn-primary btn-formulario-reset ml-3">Reset</button>
                    </div>

                </form>
            </div>


        </div >
    )
}

export default ProfileUserForm;
