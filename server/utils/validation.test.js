const expect = require('expect');

const {isRealString} = require('./validation.js');

describe('isRealString', ()=>{
    it('should reject non string values', () =>{
        var text = 90;
     
        expect(isRealString(text)).toBe(false);
    });
    it('should reject only space strings', () =>{
        var text = '        ';
     
        expect(isRealString(text)).toBe(false);
    });
    it('should allow strings with non space characters', () =>{
        var text = ' this is a test ';
     
        expect(isRealString(text)).toBe(true);
    });
});