import CaspioHelper from '../helpers/caspio';

const express = require('express');
const router = express.Router();

// GET users listing
router.get('/', async (req, res) => {
  try {
    const token = await CaspioHelper.getAccessToken();
    const users = await CaspioHelper.getAll('tables', 'Users_ES', '', token);
    res.status(200).send({ Result: users });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

// ADD a new user
router.post('/add', async (req, res) => {
  const { firstName, lastName, dateOfBirth, country, city, zipCode, address } = req.body;
  try {
    const token = await CaspioHelper.getAccessToken();
    const response = await CaspioHelper.post('tables', 'Users_ES', {
      FirstName: firstName,
      LastName: lastName,
      DateOfBirth: dateOfBirth,
      Country: country,
      City: city,
      ZipCode: zipCode,
      Address: address
    }, token);
    res.status(201).send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

// EDIT a user
router.put('/edit/:id', async (req, res) => {
  const userId = req.params.id;
  const { firstName, lastName, dateOfBirth, country, city, zipCode, address } = req.body;
  try {
    const token = await CaspioHelper.getAccessToken();
    const response = await CaspioHelper.put('tables', 'Users_ES', `q.where=UserID='${userId}'`, {
      FirstName: firstName,
      LastName: lastName,
      DateOfBirth: dateOfBirth,
      Country: country,
      City: city,
      ZipCode: zipCode,
      Address: address
    }, token);
    res.status(200).send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

// DELETE a user
router.delete('/delete/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const token = await CaspioHelper.getAccessToken();
    const response = await CaspioHelper.deleteRows('tables', 'Users_ES', `q.where=UserID='${userId}'`, token);
    res.status(200).send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

module.exports = router;
