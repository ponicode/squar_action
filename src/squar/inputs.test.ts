import rewire from "rewire"
const inputs = rewire("./inputs")
const parseJSON = inputs.__get__("parseJSON")
// @ponicode
describe("parseJSON", () => {
    test("0", () => {
        let callFunction: any = () => {
            parseJSON(() => "George", "Michael")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            parseJSON(() => "Anas", "Edmond")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            parseJSON(() => "George", "Jean-Philippe")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            parseJSON(() => "George", "Edmond")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            parseJSON(() => "Michael", "Michael")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            parseJSON(() => "", "")
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("inputs.parseSquarAPIInputs", () => {
    test("0", () => {
        let callFunction: any = () => {
            inputs.parseSquarAPIInputs(() => "Pierre Edouard")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            inputs.parseSquarAPIInputs(() => "Anas")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            inputs.parseSquarAPIInputs(() => "George")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            inputs.parseSquarAPIInputs(() => "Michael")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            inputs.parseSquarAPIInputs(() => "Jean-Philippe")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            inputs.parseSquarAPIInputs(() => "")
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("inputs.parseActionInputs", () => {
    test("0", () => {
        let callFunction: any = () => {
            inputs.parseActionInputs(() => "Anas")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            inputs.parseActionInputs(() => "George")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            inputs.parseActionInputs(() => "Michael")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            inputs.parseActionInputs(() => "Pierre Edouard")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            inputs.parseActionInputs(() => "Edmond")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            inputs.parseActionInputs(() => "")
        }
    
        expect(callFunction).not.toThrow()
    })
})
