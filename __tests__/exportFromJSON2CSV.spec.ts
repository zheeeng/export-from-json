import exportFromJSON from '../src/exportFromJSON';


describe('exportFromJSON works on CSV export type', () => {
    it('works with no double quotes case', () => {
        const data = [
            {
                "Name": "万历十五年",
                "Author": "黃仁宇",
                "Subject": "History",
                "Publication Date": 1981
            },
            {
                "Name": "L'Ancien Régime et la Révolution",
                "Author": "Alexis de Tocqueville",
                "Subject": "History",
                "Publication Date": 1866
            },
            {
                "Name": "A Brief History of Time",
                "Author": "Stephen Hawking",
                "Subject": "Cosmology",
                "Publication Date": 1988
            },
            {
                "Name": "失楽園",
                "Author": "渡辺淳一",
                "Subject": "Novel",
                "Publication Date": 1995
            }
        ]

      expect(exportFromJSON({
          data: data,
          exportType: 'csv',
          processor: content => content,
      }))
      .toEqual(
            `Name,Author,Subject,Publication Date` + '\r\n' +
            `万历十五年,黃仁宇,History,1981` + '\r\n' +
            `L'Ancien Régime et la Révolution,Alexis de Tocqueville,History,1866` + '\r\n' +
            `A Brief History of Time,Stephen Hawking,Cosmology,1988` + '\r\n' +
            `失楽園,渡辺淳一,Novel,1995`
        )
    })

    it('works with double quotes case', () => {
        const data = [
            {
                "Name": "万历十五年",
                "Author": "黃仁宇",
                "Subject": "History",
                "Publication Date": 1981,
                "addition": 'ad"dit"ion'
            },
            {
                "Name": "L'Ancien Régime et la Révolution",
                "Author": "Alexis de Tocqueville",
                "Subject": "History",
                "Publication Date": 1866
            },
            {
                "Name": "A Brief History of Time",
                "Author": "Stephen Hawking",
                "Subject": "Cosmology",
                "Publication Date": 1988
            },
            {
                "Name": "失楽園",
                "Author": "渡辺淳一",
                "Subject": "Novel",
                "Publication Date": 1995
            }
        ]

      expect(exportFromJSON({
          data: data,
          exportType: 'csv',
          processor: content => content,
      }))
      .toEqual(
            `Name,Author,Subject,Publication Date,addition` + '\r\n' +
            `万历十五年,黃仁宇,History,1981,"ad""dit""ion"` + '\r\n' +
            `L'Ancien Régime et la Révolution,Alexis de Tocqueville,History,1866,` + '\r\n' +
            `A Brief History of Time,Stephen Hawking,Cosmology,1988,` + '\r\n' +
            `失楽園,渡辺淳一,Novel,1995,`
        )
    })

    it('works with comma case', () => {
        const data = [
            {
                "Name": "万历十五年",
                "Author": "黃仁宇",
                "Subject": "History",
                "Publication Date": 1981,
                "addition": 'add,ition'
            },
            {
                "Name": "L'Ancien Régime et la Révolution",
                "Author": "Alexis de Tocqueville",
                "Subject": "History",
                "Publication Date": 1866
            },
            {
                "Name": "A Brief History of Time",
                "Author": "Stephen Hawking",
                "Subject": "Cosmology",
                "Publication Date": 1988
            },
            {
                "Name": "失楽園",
                "Author": "渡辺淳一",
                "Subject": "Novel",
                "Publication Date": 1995
            }
        ]

      expect(exportFromJSON({
          data: data,
          exportType: 'csv',
          processor: content => content,
      }))
      .toEqual(
            `Name,Author,Subject,Publication Date,addition` + '\r\n' +
            `万历十五年,黃仁宇,History,1981,"add,ition"` + '\r\n' +
            `L'Ancien Régime et la Révolution,Alexis de Tocqueville,History,1866,` + '\r\n' +
            `A Brief History of Time,Stephen Hawking,Cosmology,1988,` + '\r\n' +
            `失楽園,渡辺淳一,Novel,1995,`
        )
    })

    it('works with line break case', () => {
        const data = [
            {
                "Name": "万历十五年",
                "Author": "黃仁宇",
                "Subject": "History",
                "Publication Date": 1981,
                "addition": 'add\nition'
            },
            {
                "Name": "L'Ancien Régime et la Révolution",
                "Author": "Alexis de Tocqueville",
                "Subject": "History",
                "Publication Date": 1866
            },
            {
                "Name": "A Brief History of Time",
                "Author": "Stephen Hawking",
                "Subject": "Cosmology",
                "Publication Date": 1988
            },
            {
                "Name": "失楽園",
                "Author": "渡辺淳一",
                "Subject": "Novel",
                "Publication Date": 1995
            }
        ]

      expect(exportFromJSON({
          data: data,
          exportType: 'csv',
          processor: content => content,
      }))
      .toEqual(
            `Name,Author,Subject,Publication Date,addition` + '\r\n' +
            `万历十五年,黃仁宇,History,1981,"add\nition"` + '\r\n' +
            `L'Ancien Régime et la Révolution,Alexis de Tocqueville,History,1866,` + '\r\n' +
            `A Brief History of Time,Stephen Hawking,Cosmology,1988,` + '\r\n' +
            `失楽園,渡辺淳一,Novel,1995,`
        )
    })

    it('works with line break case', () => {
        const data = [
            {
                "Name": "万历十五年",
                "Author": "黃仁宇",
                "Subject": "History",
                "Publication Date": 1981,
                "addition": 'add\r\nition'
            },
            {
                "Name": "L'Ancien Régime et la Révolution",
                "Author": "Alexis de Tocqueville",
                "Subject": "History",
                "Publication Date": 1866
            },
            {
                "Name": "A Brief History of Time",
                "Author": "Stephen Hawking",
                "Subject": "Cosmology",
                "Publication Date": 1988
            },
            {
                "Name": "失楽園",
                "Author": "渡辺淳一",
                "Subject": "Novel",
                "Publication Date": 1995
            }
        ]

      expect(exportFromJSON({
          data: data,
          exportType: 'csv',
          processor: content => content,
      }))
      .toEqual(
            `Name,Author,Subject,Publication Date,addition` + '\r\n' +
            `万历十五年,黃仁宇,History,1981,"add\r\nition"` + '\r\n' +
            `L'Ancien Régime et la Révolution,Alexis de Tocqueville,History,1866,` + '\r\n' +
            `A Brief History of Time,Stephen Hawking,Cosmology,1988,` + '\r\n' +
            `失楽園,渡辺淳一,Novel,1995,`
        )
    })
})