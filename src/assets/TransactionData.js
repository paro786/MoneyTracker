function createData(name, date, status, amount, category) {
    return {
        name,
        date,
        status,
        amount,
        category,
    };
}
const data = [
    createData("Cupcake", 305, "hjdkjs", 67, 4.3),
    createData("Donut", 452, 0, 51, 4.9),
    createData("Eclair", 262, 0, 24, 6.0),
    createData("Frozen yoghurt", 159, 3.7, 24, 4.0),
    createData("Gingerbread", 356, 0, 49, 3.9),
    createData("Honeycomb", 408, 3.7, 87, 6.5),
    createData("Ice cream sandwich", 237, 0, 37, 4.3),
    createData("Jelly Bean", 375, 3.7, 94, 0.0),
    createData("KitKat", 518, 0, 65, 7.0),
    createData("Lollipop", 392, 0, 98, 0.0),
    createData("Marshmallow", 318, 0, 81, 2.0),
    createData("Nougat", 360, 3.7, 9, 37.0),
    createData("Oreo", 437, 3.7, 63, 4.0)
];

export default data;
