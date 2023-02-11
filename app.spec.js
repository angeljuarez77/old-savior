const request = require('supertest');
const { app } = require('./app');

const fs = require('fs');
const path = require('path');

afterEach(() => {
  const directory = './images'
  fs.readdir(directory, (err, files) => {
    if (err) throw err;
    for (const file of files) {
      fs.unlink(path.join(directory, file), (err) => {
        if (err) throw err;
      });
    }
  });
})

describe('IG - file downloads', () => {
  test('Downloads single image', () => {
    return request(app)
      .post('/save')
      .send({
        url: 'https://www.instagram.com/p/CYCbKgnpfkg/?igshid=OTRmMjhlYjM='
      })
      .then(res => {
        expect(res.statusCode).toBe(200);
        expect(fs.existsSync('./images/wayne_pinkston-dec_28_2021--1.jpg')).toEqual(true);
      });
  });

  test('Downloads multiple images', () => {
    return request(app)
      .post('/save')
      .send({
        url: 'https://www.instagram.com/p/CYxDiC_Jxqz/?igshid=OTRmMjhlYjM='
      })
      .then(res => {
        expect(res.statusCode).toBe(200);
        expect(fs.existsSync('./images/wayne_pinkston-jan_15_2022--1.jpg')).toEqual(true);
        expect(fs.existsSync('./images/wayne_pinkston-jan_15_2022--2.jpg')).toEqual(true);
        expect(fs.existsSync('./images/wayne_pinkston-jan_15_2022--3.jpg')).toEqual(true);
        expect(fs.existsSync('./images/wayne_pinkston-jan_15_2022--4.jpg')).toEqual(true);
      });
  });
});
