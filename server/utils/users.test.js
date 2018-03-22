const expect = require('expect');

const {Users} = require('./users');

describe('Users', ()=> {

    var users;
    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: 1,
            name: 'Mike',
            room: 'Node Course'
        }, {
            id: 2,
            name: 'Jen',
            room: 'React Course'
        }, {
            id: 3,
            name: 'Julie',
            room: 'Node Course'        
        }]
    });

    it('should create a new user', () => {
        var users = new Users();
        var user = {
            id: '123',
            name: 'Andrew',
            room: 'The Office Fans'
        };
        var resUser = users.addUser(user.id, user.name, user.room);
        expect(users.users).toEqual([user]);
    });

    it('should remove a  user', () => {

        var resUser = users.removeUser(1);
        expect(users.users).toEqual([{
            id: 2,
            name: 'Jen',
            room: 'React Course'
        }, {
            id: 3,
            name: 'Julie',
            room: 'Node Course'        
        }]);
    });    
    it('should not remove a user', () => {
        var resUser = users.removeUser(8);
        
        expect(resUser).toNotExist();
    });
    it('should find user', () => {
        var resUser = users.getUser(3);
        expect(resUser.id).toBe(3);
    });
    it('should not find user', () => {
        var resUser = users.getUser(8);
        expect(resUser).toNotExist();
    });



    it('should return names for node course', () => {
        var userList = users.getUserList('Node Course');
        expect(userList).toEqual(['Mike', 'Julie']);
    });
    it('should return names for react course', () => {
        var userList = users.getUserList('React Course');
        expect(userList).toEqual(['Jen']);
    });
});