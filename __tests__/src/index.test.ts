import rewire from "rewire"
const index = rewire("../../src/index")
const check_args = index.__get__("check_args")
// @ponicode
describe("check_args", () => {
    test("0", () => {
        check_args(["Marketing", "Data Scientist", "Data Scientist", "Chief Product Officer"])
    })

    test("1", () => {
        check_args(["Chief Product Officer", "Sales", "Marketing"])
    })
})
