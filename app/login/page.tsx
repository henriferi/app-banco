'use client';

import React, { useState } from 'react';
import { TextField, Button, Typography, Alert, Modal } from '@mui/material';
import bcrypt from 'bcryptjs';

const LoginPage: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false); 

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

    if (storedUser.email === email && bcrypt.compareSync(password, storedUser.password)) {
      const token = 'teste-token'; // Você pode gerar um token real aqui
      localStorage.setItem('token', token);
      window.location.href = '/main'; 
    } else {
      setError('Email ou senha inválidos!');
    }
  };

  const handleRegister = () => {
    if (!name || !email || !password || !confirmPassword) {
      setError('Todos os campos são obrigatórios!');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem!');
      return;
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = { name, email, password: hashedPassword };
    localStorage.setItem('user', JSON.stringify(user));
    setModalOpen(true);
    resetForm(); 
    setError(''); 
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setIsRegistering(false);
    setEmail(email); 
    setPassword(password); 
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-zinc-100">
      <Typography variant="h3" className="mb-4">Seu banco digital</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      
      <fieldset className="border-2 border-gray-300 rounded p-4 w-full max-w-md">
        <legend className="text-2xl font-semibold">{isRegistering ? 'Cadastro' : 'Login'}</legend>
        
        {isRegistering && (
          <TextField
            label="Nome"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="my-2"
            required
            fullWidth
          />
        )}
        <TextField
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="my-2"
          required
          fullWidth
        />
        <TextField
          label="Senha"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="my-2"
          required
          fullWidth
        />
        {isRegistering && (
          <TextField
            label="Confirmação de Senha"
            type="password"
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="my-2"
            required
            fullWidth
          />
        )}
        <Button variant="contained" color="primary" onClick={isRegistering ? handleRegister : handleLogin} className="w-full">
          {isRegistering ? 'Cadastrar' : 'Entrar'}
        </Button>
        <Button onClick={() => setIsRegistering(!isRegistering)} className="w-full">
          {isRegistering ? 'Já tem uma conta? Faça login' : 'Não tem conta? Crie uma'}
        </Button>
      </fieldset>

      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div className="flex flex-col items-center justify-center h-screen bg-white p-4 rounded shadow-lg">
          <Typography variant="h6" className="mb-4">Cadastro realizado com sucesso!</Typography>
          <Button variant="contained" onClick={handleCloseModal}>
            Fechar
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default LoginPage;
