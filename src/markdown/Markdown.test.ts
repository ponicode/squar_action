import * as Markdown from "./Markdown"
// @ponicode
describe("Markdown.Markdown.createSQUARErrorMessage", () => {
    test("0", async () => {
        await Markdown.Markdown.createSQUARErrorMessage("ValueError exception should be raised", "http://www.example.com/route/123?foo=bar")
    })

    test("1", async () => {
        await Markdown.Markdown.createSQUARErrorMessage("Error in retrieving email.", "ponicode.com")
    })

    test("2", async () => {
        await Markdown.Markdown.createSQUARErrorMessage("Error in retrieving email.", "https://twitter.com/path?abc")
    })

    test("3", async () => {
        await Markdown.Markdown.createSQUARErrorMessage("This is an exception, voilà", "http://www.example.com/route/123?foo=bar")
    })

    test("4", async () => {
        await Markdown.Markdown.createSQUARErrorMessage("To force deletion of the LAG use delete_force: True", "http://www.example.com/route/123?foo=bar")
    })

    test("5", async () => {
        await Markdown.Markdown.createSQUARErrorMessage("", "")
    })
})

// @ponicode
describe("Markdown.Markdown.createUTErrorMessage", () => {
    test("0", async () => {
        await Markdown.Markdown.createUTErrorMessage("Error:", "https://croplands.org/app/a/reset?token=")
    })

    test("1", async () => {
        await Markdown.Markdown.createUTErrorMessage("Empty name specified", "https://croplands.org/app/a/confirm?t=")
    })

    test("2", async () => {
        await Markdown.Markdown.createUTErrorMessage("Unknown Error", "https://api.telegram.org/bot")
    })

    test("3", async () => {
        await Markdown.Markdown.createUTErrorMessage("Empty name specified", "http://example.com/showcalendar.html?token=CKF50YzIHxCTKMAg")
    })

    test("4", async () => {
        await Markdown.Markdown.createUTErrorMessage("ValueError exception should be raised", "Www.GooGle.com")
    })

    test("5", async () => {
        await Markdown.Markdown.createUTErrorMessage("", "")
    })
})

// @ponicode
describe("Markdown.Markdown.createTestCodeComment", () => {
    test("0", () => {
        let param1: any = [{ filePath: "/usr/sbin/tan_district.geo.qxt", content: "tvshows" }, { filePath: "/net/panel.dvi.crd", content: "songs" }, { filePath: "/net/panel.dvi.crd", content: "movies" }, { filePath: "/tmp/payment_invoice.ogg.cmc", content: "left_chat_member" }]
        let callFunction: any = () => {
            Markdown.Markdown.createTestCodeComment(param1)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let param1: any = [{ filePath: "/etc/ppp/pre_emptive_manager.efif.bcpio", content: "photo" }, { filePath: "/net/panel.dvi.crd", content: "text/plain" }, { filePath: "/var/up_pink.stl.atx", content: "audio" }, { filePath: "/tmp/payment_invoice.ogg.cmc", content: "text" }, { filePath: "/var/up_pink.stl.atx", content: "seasons" }]
        let callFunction: any = () => {
            Markdown.Markdown.createTestCodeComment(param1)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let param1: any = [{ filePath: "/etc/ppp/pre_emptive_manager.efif.bcpio", content: "html" }, { filePath: "/etc/ppp/pre_emptive_manager.efif.bcpio", content: "songs" }, { filePath: "/net/panel.dvi.crd", content: "seasons" }, { filePath: "/var/up_pink.stl.atx", content: "document" }, { filePath: "/tmp/payment_invoice.ogg.cmc", content: "venue" }]
        let callFunction: any = () => {
            Markdown.Markdown.createTestCodeComment(param1)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let param1: any = [{ filePath: "/etc/ppp/pre_emptive_manager.efif.bcpio", content: "json" }, { filePath: "/usr/sbin/tan_district.geo.qxt", content: "movies" }, { filePath: "/etc/ppp/pre_emptive_manager.efif.bcpio", content: "left_chat_member" }, { filePath: "/net/panel.dvi.crd", content: "video" }]
        let callFunction: any = () => {
            Markdown.Markdown.createTestCodeComment(param1)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let param1: any = [{ filePath: "/var/up_pink.stl.atx", content: "application/data" }, { filePath: "/etc/ppp/pre_emptive_manager.efif.bcpio", content: "albums" }, { filePath: "/tmp/payment_invoice.ogg.cmc", content: "albums" }, { filePath: "/net/panel.dvi.crd", content: "tvshows" }]
        let callFunction: any = () => {
            Markdown.Markdown.createTestCodeComment(param1)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            Markdown.Markdown.createTestCodeComment([])
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("Markdown.Markdown.appendUTOverviewMessages", () => {
    test("0", () => {
        let param1: any = [{ filePath: "/etc/ppp/pre_emptive_manager.efif.bcpio", content: "new_chat_member" }, { filePath: "/net/panel.dvi.crd", content: "html" }, { filePath: "/usr/sbin/tan_district.geo.qxt", content: "seasons" }, { filePath: "/etc/ppp/pre_emptive_manager.efif.bcpio", content: "html" }]
        let callFunction: any = () => {
            Markdown.Markdown.appendUTOverviewMessages(param1)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let param1: any = [{ filePath: "/net/panel.dvi.crd", content: "tvshows" }, { filePath: "/net/panel.dvi.crd", content: "left_chat_member" }, { filePath: "/net/panel.dvi.crd", content: "json" }, { filePath: "/var/up_pink.stl.atx", content: "seasons" }]
        let callFunction: any = () => {
            Markdown.Markdown.appendUTOverviewMessages(param1)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let param1: any = [{ filePath: "/net/panel.dvi.crd", content: "albums" }]
        let callFunction: any = () => {
            Markdown.Markdown.appendUTOverviewMessages(param1)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let param1: any = [{ filePath: "/tmp/payment_invoice.ogg.cmc", content: "application/data" }, { filePath: "/usr/sbin/tan_district.geo.qxt", content: "application/data" }, { filePath: "/var/up_pink.stl.atx", content: "tvshows" }]
        let callFunction: any = () => {
            Markdown.Markdown.appendUTOverviewMessages(param1)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let param1: any = [{ filePath: "/usr/sbin/tan_district.geo.qxt", content: "html" }, { filePath: "/net/panel.dvi.crd", content: "text/plain" }, { filePath: "/etc/ppp/pre_emptive_manager.efif.bcpio", content: "json" }, { filePath: "/usr/sbin/tan_district.geo.qxt", content: "episodes" }]
        let callFunction: any = () => {
            Markdown.Markdown.appendUTOverviewMessages(param1)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            Markdown.Markdown.appendUTOverviewMessages([])
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("createAlertsMessage", () => {
    let inst: any

    beforeEach(() => {
        inst = new Markdown.Markdown("", "", undefined)
    })

    test("0", () => {
        let callFunction: any = () => {
            inst.createAlertsMessage(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("createFullReportMessage", () => {
    let inst: any

    beforeEach(() => {
        inst = new Markdown.Markdown("", "", undefined)
    })

    test("0", async () => {
        await inst.createFullReportMessage()
    })
})

// @ponicode
describe("createNewPRComment", () => {
    let inst: any

    beforeEach(() => {
        inst = new Markdown.Markdown("", "", undefined)
    })

    test("0", () => {
        let param2: any = [{ filePath: "/net/panel.dvi.crd", content: "seasons" }, { filePath: "/usr/sbin/tan_district.geo.qxt", content: "venue" }]
        let callFunction: any = () => {
            inst.createNewPRComment("https://api.telegram.org/", param2)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let param2: any = [{ filePath: "/tmp/payment_invoice.ogg.cmc", content: "artists" }, { filePath: "/usr/sbin/tan_district.geo.qxt", content: "json" }, { filePath: "/usr/sbin/tan_district.geo.qxt", content: "text/plain" }]
        let callFunction: any = () => {
            inst.createNewPRComment("https://", param2)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let param2: any = [{ filePath: "/var/up_pink.stl.atx", content: "audio" }, { filePath: "/tmp/payment_invoice.ogg.cmc", content: "application/data" }]
        let callFunction: any = () => {
            inst.createNewPRComment("http://base.com", param2)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let param2: any = [{ filePath: "/etc/ppp/pre_emptive_manager.efif.bcpio", content: "document" }, { filePath: "/net/panel.dvi.crd", content: "contact" }, { filePath: "/var/up_pink.stl.atx", content: "sticker" }]
        let callFunction: any = () => {
            inst.createNewPRComment("https://croplands.org/app/a/reset?token=", param2)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let param2: any = [{ filePath: "/net/panel.dvi.crd", content: "text" }]
        let callFunction: any = () => {
            inst.createNewPRComment("https://", param2)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            inst.createNewPRComment("", [])
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("appendMessageWithAlerts", () => {
    let inst: any

    beforeEach(() => {
        inst = new Markdown.Markdown("", "", undefined)
    })

    test("0", () => {
        let callFunction: any = () => {
            inst.appendMessageWithAlerts(undefined, "")
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("addAlertsToFullReportComment", () => {
    let inst: any

    beforeEach(() => {
        inst = new Markdown.Markdown("", "", undefined)
    })

    test("0", () => {
        let callFunction: any = () => {
            inst.addAlertsToFullReportComment("note.txt")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            inst.addAlertsToFullReportComment("image.png")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            inst.addAlertsToFullReportComment("index.js")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            inst.addAlertsToFullReportComment("program.exe")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            inst.addAlertsToFullReportComment("install.deb")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            inst.addAlertsToFullReportComment("")
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("generateMessageFromMDFile", () => {
    let inst: any

    beforeEach(() => {
        inst = new Markdown.Markdown("", "", undefined)
    })

    test("0", async () => {
        await inst.generateMessageFromMDFile("libclang.so")
    })

    test("1", async () => {
        await inst.generateMessageFromMDFile("libclang.dylib")
    })

    test("2", async () => {
        await inst.generateMessageFromMDFile("InfoPlist.strings")
    })

    test("3", async () => {
        await inst.generateMessageFromMDFile(":")
    })

    test("4", async () => {
        await inst.generateMessageFromMDFile("decoder.hh")
    })

    test("5", async () => {
        await inst.generateMessageFromMDFile("")
    })
})
