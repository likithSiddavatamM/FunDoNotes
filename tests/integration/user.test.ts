import { expect } from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/index';
import keepnotes from '../../src/models/note.model';
import user from '../../src/models/user.model';

const mockUser = {
  firstName: 'liki',
  lastName: 'siddu',
  email: 'likisis@gmail.com',
  password: 'Blackspy111111'
};
let token, data_id;

before(async () => {
  await mongoose.connect(process.env.DATABASE_TEST, { useNewUrlParser: true, useUnifiedTopology: true });
  await keepnotes.deleteMany({});
  await user.deleteMany({});
});

describe('User Operation tests', () => {
  it('Register User Operation: should accept a new user', (done) => {
    request(app.getApp())
      .post('/api/v1/fundonotes/user/')
      .send(mockUser)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).to.be.equal(`User with name ${mockUser.firstName} ${mockUser.lastName} is been created successfully, you can login using ${mockUser.email}`);
        done();
      });
  });

  it('Register User Operation: should reject a user who is present already', (done) => {
    request(app.getApp())
      .post('/api/v1/fundonotes/user/')
      .send(mockUser)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(400);
        expect(res.body.message).to.be.equal(`User with name is already registered through the email id`);
        done();
      });
  });

  let user = {
    email: mockUser.email,
    password: mockUser.password
  };

  it('Login User Operations: should login a new user', (done) => {
    request(app.getApp())
      .post('/api/v1/fundonotes/user/login')
      .send(user)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body.message).to.be.equal(`You are now loggedIn as ${mockUser.firstName} ${mockUser.lastName}, using ${mockUser.email}`);
        token = res.body.accessToken;
        done();
      });
  });

  it('Login User Operations: should not login and tell to register', (done) => {
    let user1 = {
      email: 'likiisid@gmail.com',
      password: 'Blackspy111111'
    };
    request(app.getApp())
      .post('/api/v1/fundonotes/user/login')
      .send(user1)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).to.be.equal(`User with email ${user1.email} doesn't exist, please go with the registration`);
        done();
      });
  });

  it('Login User Operations: should not login and password error', (done) => {
    let user2 = {
      email: mockUser.email,
      password: 'Blackspfgy@$100864$'
    };
    request(app.getApp())
      .post('/api/v1/fundonotes/user/login')
      .send(user2)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(400);
        expect(res.body.message).to.be.equal(`You have entered a incorrect password, try again`);
        done();
      });
  });
});

describe('Note Operation tests', () => {
  let note = {
    "title": "likith",
    "description": "kwbdhbshbdhbshbds"
  };

  it('Create Note Operation: should successfully create a note and return a 201 status', (done) => {
    request(app.getApp())
      .post('/api/v1/fundonotes/usernotes/')
      .set('Authorization', `Bearer ${token}`)
      .send(note)
      .end((err, res) => {
        expect(res.status).to.be.equal(201);
        expect(res.body.data).to.have.property('title');
        done();
      });
  });

  describe('Get ID for Operations', () => {
    before(async () => {
      data_id = JSON.parse(JSON.stringify(await keepnotes.findOne({})))._id;
    });

    it('Readnote Note Operation: should return 400 for invalid note ID', (done) => {
      request(app.getApp())
        .get(`/api/v1/fundonotes/usernotes/123456789123456789123456`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(400);
          done();
        });
    });

    it('Readnote Note Operation: should return 200 for valid note ID', (done) => {
      request(app.getApp())
        .get(`/api/v1/fundonotes/usernotes/${data_id}`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.data).to.have.property('title');
          done();
        });
    });

    it('Readnotes Operation: should successfully return all user notes with valid JWT and cache result', (done) => {
      request(app.getApp())
        .get('/api/v1/fundonotes/usernotes/')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.data).to.be.an('array').that.is.not.empty;
          expect(res.body.data[0]).to.have.property('title', note.title);
          expect(res.body.data[0]).to.have.property('description', note.description);
          done();
        });
    });

    it('Update Note Operation: should successfully update notes', (done) => {
      request(app.getApp())
        .put(`/api/v1/fundonotes/usernotes/${data_id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(note)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.status).to.be.equal('Note Updated Successfully');
          done();
        });
    });

    it('Trash Note Operation: should successfully trash particular user note', (done) => {
      request(app.getApp())
        .put(`/api/v1/fundonotes/usernotes/${data_id}/trash`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.status).to.be.equal(`Deleted the Note (id:${data_id})`);
          done();
        });
    });

    it('Trash Note Operation: should successfully restore particular user note from trash', (done) => {
      request(app.getApp())
        .put(`/api/v1/fundonotes/usernotes/${data_id}/trash`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.status).to.be.equal(`Restored the Note from TrashBin (id:${data_id})`);
          done();
        });
    });

    it('Archive Note Operation: should successfully archive particular user note', (done) => {
      request(app.getApp())
        .put(`/api/v1/fundonotes/usernotes/${data_id}/archive`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.status).to.be.equal(`Archived`);
          done();
        });
    });

    it('Archive Note Operation: should successfully restore particular user note from archives', (done) => {
      request(app.getApp())
        .put(`/api/v1/fundonotes/usernotes/${data_id}/archive`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.status).to.be.equal(`Restored from Archives`);
          done();
        });
    });

    it('Delete Permanently Note Operation: should successfully delete particular user note from trashbin', (done) => {
      request(app.getApp())
        .delete(`/api/v1/fundonotes/usernotes/${data_id}`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property(`RecordsDeleted`);
          done();
        });
    });

    it('Archive Note Operation: should not archive user note and display the message as "No such data"', (done) => {
      request(app.getApp())
        .put(`/api/v1/fundonotes/usernotes/123456789111111111111111/archive`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(400);
          expect(res.body.message).to.be.equal(`No such data`);
          done();
        });
    });

    it('Archive Note Operation: should not restore user note and display the message as "No such data"', (done) => {
      request(app.getApp())
        .put(`/api/v1/fundonotes/usernotes/123456789111111111111111/archive`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(400);
          expect(res.body.message).to.be.equal(`No such data`);
          done();
        });
    });

    it('Archives Note Operation: should successfully return array of Notes as result from archives', (done) => {
      request(app.getApp())
        .get(`/api/v1/fundonotes/usernotes/archive/archives`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.data).to.be.an('array');
          done();
        });
    });

    it('TrashBin Note Operation: should successfully return array of Notes as result from trashbin', (done) => {
      request(app.getApp())
        .get(`/api/v1/fundonotes/usernotes/trash/trashbin`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.data).to.be.an('array');
          done();
        });
    });
  });
});
