'use client';

import React, { useEffect, useState } from 'react';
import { Typography, Button, Snackbar, TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const MainPage: React.FC = () => {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [balance, setBalance] = useState<number>(0);
  const [openLogoutModal, setOpenLogoutModal] = useState<boolean>(false);

  const [depositAmount, setDepositAmount] = useState<string>('');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [transferAmount, setTransferAmount] = useState<string>('');
  const [recipientEmail, setRecipientEmail] = useState<string>('');

  const [transactions, setTransactions] = useState<{ type: string; amount: number; recipient?: string }[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const storedBalance = Number(localStorage.getItem('balance')) || 0;
    const storedTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');

    if (token) {
      setIsAuthenticated(true);
      setUser(storedUser);
      setBalance(storedBalance);
      setTransactions(storedTransactions);
    } else {
      window.location.href = '/login';
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleShowSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const updateLocalStorage = (newBalance: number, newTransactions: typeof transactions) => {
    setBalance(newBalance);
    localStorage.setItem('balance', newBalance.toString());
    localStorage.setItem('transactions', JSON.stringify(newTransactions));
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleOpenLogoutModal = () => {
    setOpenLogoutModal(true);
  };

  const handleCloseLogoutModal = () => {
    setOpenLogoutModal(false);
  };

  const handleConfirmLogout = () => {
    handleLogout();
    handleCloseLogoutModal();
  };

  const handleDeposit = () => {
    const amount = Number(depositAmount);
    if (!isNaN(amount) && amount > 0) {
      const newBalance = balance + amount;
      const newTransactions = [...transactions, { type: 'depósito', amount }];
      updateLocalStorage(newBalance, newTransactions);
      setTransactions(newTransactions);
      handleShowSnackbar(`Depósito de R$${amount.toFixed(2)} realizado com sucesso!`, 'success');
      setDepositAmount('');
    } else {
      handleShowSnackbar('Valor de depósito inválido!', 'error');
    }
  };

  const handleWithdraw = () => {
    const amount = Number(withdrawAmount);
    if (!isNaN(amount) && amount > 0) {
      if (balance >= amount) {
        const newBalance = balance - amount;
        const newTransactions = [...transactions, { type: 'saque', amount }];
        updateLocalStorage(newBalance, newTransactions);
        setTransactions(newTransactions);
        handleShowSnackbar(`Saque de R$${amount.toFixed(2)} realizado com sucesso!`, 'success');
        setWithdrawAmount('');
      } else {
        handleShowSnackbar('Saldo insuficiente!', 'error');
      }
    } else {
      handleShowSnackbar('Valor de saque inválido!', 'error');
    }
  };

  const handleTransfer = () => {
    const amount = Number(transferAmount);
    if (!isNaN(amount) && amount > 0 && recipientEmail) {
      if (!validateEmail(recipientEmail)) {
        handleShowSnackbar('Email do destinatário inválido!', 'error');
        return;
      }

      if (balance >= amount) {
        const newBalance = balance - amount;
        const newTransactions = [...transactions, { type: 'transferência', amount, recipient: recipientEmail }];
        updateLocalStorage(newBalance, newTransactions);
        setTransactions(newTransactions);
        handleShowSnackbar(`Transferência de R$${amount.toFixed(2)} para ${recipientEmail} realizada com sucesso!`, 'success');
        setTransferAmount('');
        setRecipientEmail('');
      } else {
        handleShowSnackbar('Saldo insuficiente!', 'error');
      }
    } else {
      handleShowSnackbar('Valor de transferência ou destinatário inválido!', 'error');
    }
  };

  const handleClearTransactions = () => {
    setTransactions([]);
    localStorage.removeItem('transactions');
    handleShowSnackbar('Extrato limpo com sucesso!', 'success');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-6 mt-10">
      {isAuthenticated && user ? (
        <div className="w-full max-w-md bg-white p-3 rounded-lg shadow-md"> 
          <Typography variant="h5" className="text-center mb-3">Bem-vindo(a), {user.name}</Typography> 

          <div className="bg-green-500 p-3 rounded-lg mb-3">
            <Typography variant="h6" className="text-center text-white">
              Saldo: R${balance.toFixed(2)}
            </Typography>
          </div>

          <Typography variant="h6" className="text-center mb-2">Opções:</Typography>

          <div className="flex flex-col">
            <TextField
              label="Valor do Depósito"
              variant="outlined"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="my-1"
              type="number"
              inputProps={{ min: 0 }}
            />
            <Button variant="contained" color="primary" className="my-1" onClick={handleDeposit}>
              Fazer Depósito
            </Button>

            <TextField
              label="Valor do Saque"
              variant="outlined"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="my-1"
              type="number"
              inputProps={{ min: 0 }}
            />
            <Button variant="contained" color="primary" className="my-1" onClick={handleWithdraw}>
              Realizar Saque
            </Button>

            <TextField
              label="Valor da Transferência"
              variant="outlined"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              className="my-1"
              type="number"
              inputProps={{ min: 0 }}
            />
            <TextField
              label="Email do Destinatário"
              variant="outlined"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="my-1" 
            />
            <Button variant="contained" color="primary" className="my-1" onClick={handleTransfer}>
              Fazer Transferência
            </Button>
          </div>

          <Typography variant="h6" className="mt-4 text-center">Extrato:</Typography>
          <div className="overflow-auto max-h-16 border border-gray-300 rounded-lg p-2"> 
            <ul className="w-full mt-2 text-center">
              {transactions.map((transaction, index) => (
                <li key={index} className={transaction.type === 'depósito' ? 'text-green-600' : 'text-red-600'}>
                  {`${transaction.type}: R$${transaction.amount.toFixed(2)}${transaction.recipient ? ` (para ${transaction.recipient})` : ''}`}
                </li>
              ))}
            </ul>
          </div>

          <div className='flex flex-col gap-10'>
            <Button variant="contained" color="primary" className="mt-4 mb-2" onClick={handleClearTransactions}>
              Limpar Extrato
            </Button>

            <Button className="mt-2 bg-red-600 text-white hover:bg-red-700" onClick={handleOpenLogoutModal}>
              Sair
            </Button>

            <Dialog open={openLogoutModal} onClose={handleCloseLogoutModal}>
              <DialogTitle>Confirmação</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Você tem certeza que deseja sair?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseLogoutModal} color="primary">
                  Cancelar
                </Button>
                <Button onClick={handleConfirmLogout} color="primary">
                  Sair
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      ) : (
        <Typography variant="h5">Carregando...</Typography>
      )}

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default MainPage;





