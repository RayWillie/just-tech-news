const bcrypt = require('bcrypt');
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection.js');

// create the User model
class User extends Model {
    // method to run instance data (per user) to check password
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password);
    }
}

// define table columns and configuration

User.init(
{
    // Table Column ddefinitions belong here
    id: {
        type: DataTypes.INTEGER,
        // this is the equivalent of SQL's `NOT NULL` option
        allowNull: false,
        // Primary key control
        primaryKey: true,
        //  auto increment
        autoIncrement: true
    },
    // define a username
    
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        
            // define email column
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                // no duplicate email addresses
                unique: true,
                // if allowNull is set to false, we can run our data through validators before creating the table data
                validate: {
                    isEmail: true
                }
            },
    // define a password column
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            // dictate the term of - here password must at least four characters long
            len: [4]
        }
    }
},

{
    // Tabel config options go here
    hooks: {
        // set up beforeCreate lifecycle hook functionality
         async beforeCreate(newUserData) {
            newUserData.password = await bcrypt.hash(newUserData.password, 10);
               return newUserData;
            },
        
    
    //  set up beforeUpdate lifecycle hook functionality
        async beforeUpdate(updatedUserData) {
            updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
            return updatedUserData
        }
    },


    // pass in importted sequelize connection (the direct connection to the database)

    sequelize,
    //  don't automatically create createdAt/updateAt timestamp fields
    timestamps: false,
    // don't pluralize name of database table
    freezeTableName: true,
    // use underscores instead of camel-casing
     underscored: true,
    //  make it so the model name stays lowercase in the database
    modelName: 'user'
}
);

module.exports = User;