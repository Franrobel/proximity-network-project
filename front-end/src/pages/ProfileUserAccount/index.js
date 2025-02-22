import './ProfileUserAccount.css'
import ProfileUserFormAcount from '../../components/ProfileUserFormAccount';
import { Link, NavLink } from 'react-router-dom'
import ProfileUserNavLink from '../../components/ProfileUserNavLink'


const ProfileUserAccount = () => {
    return (
        <>

            <section id="profileAccountHeader">
                <div className='container px-4 px-lg-0'>
                    <h1>Your Account</h1>
                    <div className="row align-items-center justify-content-between">
                        <div className="col-8">
                            <p className="account-parrafo">Here you can update your account.</p>
                        </div>
                    </div>
                </div>
                <ProfileUserNavLink />
                <ProfileUserFormAcount></ProfileUserFormAcount>
            </section>
        </>

    )
}

export default ProfileUserAccount;