function getUser(i) {
    switch (i) {
        case 0:
            return {
                "userId": 0,
                "fName": "Kostas",
                "lName": "Kolivas",
                "profilePicture": "pics/pic1.jpeg",
                "description": "This is the first profile"
            }
        case 1:
            return {
                "userId": 1,
                "fName": "Erika",
                "lName": "Koliva",
                "profilePicture": "pics/pic2.jpeg",
                "description": "Ths is the second profile"
            }
        case 2:
            return {
                "userId": 2,
                "fName": "Mimi",
                "lName": "Demy",
                "profilePicture": "pics/pic3.jpeg",
                "description": "This is the third profile"
            }
        case "*":
            return [{
                "userId": 0,
                "fName": "Kostas",
                "lName": "Kolivas",
                "email": "kwstaskolivas@gmail.com",
                "profilePicture": "pics/pic1.jpeg",
                "description": "This is the first profile"
            }, {
                "userId": 1,
                "fName": "Erika",
                "lName": "Koliva",
                "email": "eriketikoliva@gmail.com",
                "profilePicture": "pics/pic2.jpeg",
                "description": "Ths is the second profile"
            }, {
                "userId": 2,
                "fName": "Mimi",
                "lName": "Demy",
                "email": "mimi6demy@gmail.com",
                "profilePicture": "pics/pic3.jpeg",
                "description": "This is the third profile"
            }]
    }
}