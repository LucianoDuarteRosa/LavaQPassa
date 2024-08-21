// BIBLIOTECAS
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// IMPORTAÇÕES
import { AuthProvider, useAuth } from './components/login/authContext';
import Navbar from './components/navbar';
import Manager from './components/manager';
import CreateUser from './components/user/createUser';
import SearchUser from './components/user/searchUser';
import UpdateUser from './components/user/updateUser';
import CreateGroup from './components/group/createGroup';
import SearchGroup from './components/group/searchGroup';
import UpdateGroup from './components/group/updateGroup';
import CreateSubGroup from './components/subGroup/createSubGroup';
import SearchSubGroup from './components/subGroup/searchSubGroup';
import UpdateSubGroup from './components/subGroup/updateSubGroup';
import CreateClientSupplier from './components/clientsupplier/createClientSupplier';
import SearchClientSupplier from './components/clientsupplier/searchClientSupplier';
import UpdateClientSupplier from './components/clientsupplier/updateClientSupplier';
import CreateProduct from './components/product/createProduct';
import SearchProduct from './components/product/searchProduct';
import UpdateProduct from './components/product/updateProduct';
import CreateAccountsPayable from './components/accountsPayable/createAccountsPayable';
import SearchAccountsPayable from './components/accountsPayable/searchAccountsPayable';
import UpdateAccountsPayable from './components/accountsPayable/updateAccountsPayable';
import DetailsAccountsPayable from './components/accountsPayable/detailsAccountsPayable';
import CreateAccountsReceivable from './components/accountsReceivable/createAccountsReceivable';
import SearchAccountsReceivable from './components/accountsReceivable/searchAccountsReceivable';
import UpdateAccountsReceivable from './components/accountsReceivable/updateAccountsReceivable';
import DetailsAccountsReceivable from './components/accountsReceivable/detailsAccountsReceivable';
import CreateSale from './components/sale/createSale';
import UpdateSale from './components/sale/updateSale';
import SearchSale from './components/sale/searchSale';
import Home from './components/home';
import Login from './components/login/login';
import PrivateRoute from './components/login/privateRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div>
          <Navbar />
        </div>
        <Routes>
          <Route exact path='/login' element={<Login />} />
          <Route element={<PrivateRoute />}>
            <Route exact path='/' element={<Home />} />
            <Route path="/manager" element={<Manager />} />
            <Route path='/createuser' element={<CreateUser />} />
            <Route path='/searchuser' element={<SearchUser />} />
            <Route path="/updateuser/:id" element={<UpdateUser />} />
            <Route path='/creategroup' element={<CreateGroup />} />
            <Route path='/searchgroup' element={<SearchGroup />} />
            <Route path="/updategroup/:id" element={<UpdateGroup />} />
            <Route path='/createsubgroup' element={<CreateSubGroup />} />
            <Route path='/searchsubgroup' element={<SearchSubGroup />} />
            <Route path="/updatesubgroup/:id" element={<UpdateSubGroup />} />
            <Route path='/createclient' element={<CreateClientSupplier />} />
            <Route path='/searchclient' element={<SearchClientSupplier />} />
            <Route path="/updateclient/:id" element={<UpdateClientSupplier />} />
            <Route path='/createproduct' element={<CreateProduct />} />
            <Route path='/searchproduct' element={<SearchProduct />} />
            <Route path="/updateproduct/:id" element={<UpdateProduct />} />
            <Route path='/createaccountspayable' element={<CreateAccountsPayable />} />
            <Route path='/searchaccountspayable' element={<SearchAccountsPayable />} />
            <Route path="/updateaccountspayable/:id" element={<UpdateAccountsPayable />} />
            <Route path="/detailsaccountspayable/:id" element={<DetailsAccountsPayable />} />
            <Route path='/createaccountsreceivable' element={<CreateAccountsReceivable />} />
            <Route path='/searchaccountsreceivable' element={<SearchAccountsReceivable />} />
            <Route path="/updateaccountsreceivable/:id" element={<UpdateAccountsReceivable />} />
            <Route path="/detailsaccountsreceivable/:id" element={<DetailsAccountsReceivable />} />
            <Route path='/createsale' element={<CreateSale />} />
            <Route path='/searchsale' element={<SearchSale />} />
            <Route path='/updatesale/:id' element={<UpdateSale />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
