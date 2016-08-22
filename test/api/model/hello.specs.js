'use strict';
const expect = require('chai').expect;

const Hello = require('./../../../api/model/hello.js');

describe('Expect Hello', () => {
  describe('#greet()', () => {
    describe('when Hello is created with a name', () => {
      it('to greet that name', () => {
        let hello = new Hello('Bryce');
        expect(hello.greet()).to.equal('Hello, Bryce!');
      });
      it('greet a stranger when that name is null', () => {
        let hello = new Hello(null);
        expect(hello.greet()).to.equal('Hello, stranger!');
      });
      it('greet a stranger when that name is empty', () => {
        let hello = new Hello('');
        expect(hello.greet()).to.equal('Hello, stranger!');
      });
    });
    describe('when Hello is created without a name', () => {
      it('to greet a stranger', () => {
        let hello = new Hello();
        expect(hello.greet()).to.equal('Hello, stranger!');
      });
    });
  });
});
