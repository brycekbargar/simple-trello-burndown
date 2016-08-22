'use strict';
const expect = require('chai').expect;

const Hello = require('./../../../api/model/hello.js');

describe('For the Hello model expect', () => {
  describe('when Hello is created with a name', () => {
    it('to greet that name', () => {
      let hello = new Hello('Bryce');
      expect(hello.greet()).to.equal('Hello, Bryce!');
    });
    it('and that name is null to greet a stranger', () => {
      let hello = new Hello(null);
      expect(hello.greet()).to.equal('Hello, stranger!');
    });
    it('and that name is empty to greet a stranger', () => {
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
