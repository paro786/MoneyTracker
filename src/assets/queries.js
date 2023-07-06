db.collection("users")
        .where("userId", "==", id)
        
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                res.push(doc.data());
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        })
.add(finalDoc)
            .then((ref) => {
                console.log("Document successfully written!", ref.id, ref.data);
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            })
            .finally(() => handleClose())





Collection groups:-
1. Filter user/member
2. Filter id

Collection users:-
1. Filter id
2. Filter email

Collection transactions:-
1. Filter id
2. Filter 2 users
3. Filter 1 user and 1 group
4. Filter 2 users and 1 group