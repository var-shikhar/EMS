export const BACKEND_URL='http://localhost:8080';

export async function postLogin(formData) {
    try {
        const response = await fetch(`${BACKEND_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            const data = await response.json();
            const { token } = data;

            sessionStorage.setItem("authToken", token);

            const expirationDate = new Date();
            expirationDate.setHours(expirationDate.getHours() + 2);
            document.cookie = `authToken=${token}; path=/; expires=${expirationDate.toUTCString()};`;

            setTimeout(() => {
                window.location.href = "../admin/dashboard.html";
            }, 2000);
        }

    } catch (err) {
        console.error(err);
    }
}

// Genre List Calls
export async function getGenreList() {
    try {
        const token = sessionStorage.getItem("authToken");
        const response = await fetch(`${BACKEND_URL}/admin/genre`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
        });
        if (response.ok) {
            const data = await response.json();
            return data;
        }
    } catch (err) {
        console.error(err);
    }
}
export async function deleteGenreItem(genreID) {
    try {
        const token = sessionStorage.getItem("authToken");
        const response = await fetch(`${BACKEND_URL}/admin/genre/${genreID}`, {
            method: 'DELETE',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
        });
        if (response.ok) {
            const data = await response.json();
            window.location.reload();
            return true;
        }
        return false
    } catch (err) {
        console.error(err);
    }
}
export async function saveGenre(genreName) {
    try {
        const token = sessionStorage.getItem("authToken");
        const response = await fetch(`${BACKEND_URL}/admin/genre`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({name: genreName})
        });

        const data = await response.json();
        if (response.ok) {
            return true;
        } else {
            alert(data.message)
            return false
        }
    } catch (err) {
        console.error(err);
    }
}
export async function updateGenre(genreID, genreName) {
    try {
        const token = sessionStorage.getItem("authToken");
        const response = await fetch(`${BACKEND_URL}/admin/genre`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({id: genreID, name: genreName})
        });

        const data = await response.json();
        if (response.ok) {
            return true;
        } else {
            alert(data.message)
        }
    } catch (err) {
        console.error(err);
    }
}

// Category List Calls
export async function getCategoryList() {
    try {
        const token = sessionStorage.getItem("authToken");
        const response = await fetch(`${BACKEND_URL}/admin/category`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
        });
        if (response.ok) {
            const data = await response.json();
            return data;
        }
    } catch (err) {
        console.error(err);
    }
}
export async function deleteCategoryItem(categoryID) {
    try {
        const token = sessionStorage.getItem("authToken");
        const response = await fetch(`${BACKEND_URL}/admin/category/${categoryID}`, {
            method: 'DELETE',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
        });
        if (response.ok) {
            const data = await response.json();
            window.location.reload();
            return true;
        }
        return false
    } catch (err) {
        console.error(err);
    }
}
export async function saveCategory(categoryName) {
    try {
        const token = sessionStorage.getItem("authToken");
        const response = await fetch(`${BACKEND_URL}/admin/category`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({name: categoryName})
        });

        const data = await response.json();
        if (response.ok) {
            return true;
        } else {
            alert(data.message)
            return false
        }
    } catch (err) {
        console.error(err);
    }
}
export async function updateCategory(categoryID, categoryName) {
    try {
        const token = sessionStorage.getItem("authToken");
        const response = await fetch(`${BACKEND_URL}/admin/category`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({id: categoryID, name: categoryName})
        });

        const data = await response.json();
        if (response.ok) {
            return true;
        } else {
            alert(data.message)
        }
    } catch (err) {
        console.error(err);
    }
}

// Book List Calls
export async function getBookList() {
    try {
        const token = sessionStorage.getItem("authToken");
        if (!token) {
            throw new Error("Authentication token not found.");
        }

        const fetchWithAuth = async (url) => {
            const response = await fetch(url, {
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch from ${url}: ${response.statusText}`);
            }
            return await response.json();
        };

        const [bookList, categoryList, genreList, tagList] = await Promise.all([
            fetchWithAuth(`${BACKEND_URL}/admin/book`),
            fetchWithAuth(`${BACKEND_URL}/admin/category`),
            fetchWithAuth(`${BACKEND_URL}/admin/genre`),
            fetchWithAuth(`${BACKEND_URL}/admin/tag-list`)
        ]);

        return { bookList, categoryList, genreList, tagList };
        
    } catch (err) {
        console.error(err);
        throw err;
    }
}
export async function deleteBook(bookID) {
    try {
        const token = sessionStorage.getItem("authToken");
        const response = await fetch(`${BACKEND_URL}/admin/book/${bookID}`, {
            method: 'DELETE',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
        });
        const data = await response.json();
        if (response.ok) {
            window.location.reload();
            return true;
        } else{
            alert(data.message);
            return false
        }
    } catch (err) {
        console.error(err);
    }
}
export async function saveBook(formData) {
    try {
        const token = sessionStorage.getItem("authToken");
        const response = await fetch(`${BACKEND_URL}/admin/book`, {
            method: 'POST',
            headers: {'Authorization': `Bearer ${token}`},
            body: formData
        });

        const data = await response.json();
        if (response.ok) {
            return true;
        } else {
            alert(data.message)
            return false;
        }
    } catch (err) {
        console.error(err);
        return false;
    }
}
export async function updateBook(formData) {
    try {
        const token = sessionStorage.getItem("authToken");
        const response = await fetch(`${BACKEND_URL}/admin/book`, {
            method: 'PUT',
            headers: {'Authorization': `Bearer ${token}`},
            body: formData
        });

        const data = await response.json();
        if (response.ok) {
            return true;
        } else {
            alert(data.message)
            return false;
        }
    } catch (err) {
        console.error(err);
        return false;
    }
}

// Book Issue Calls
export async function getUserRoleList() {
    try {
        const token = sessionStorage.getItem("authToken");
        const response = await fetch(`${BACKEND_URL}/admin/roles`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
        });
        const data = await response.json();
        if (response.ok) return data;
        else alert(data.message)
    } catch (err) {
        console.error(err);
    }
}
export async function getUserList(userType, userName = '') {
    try {
        const token = sessionStorage.getItem("authToken");
        const response = await fetch(`${BACKEND_URL}/admin/users/${userType}/${userName}`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
        });
        const data = await response.json();
        if (response.ok) return data;
        else alert(data.message)
    } catch (err) {
        console.error(err);
    }
}
export async function getValidateUserforBookIssue(bookID, userID) {
    try {
        const token = sessionStorage.getItem("authToken");
        const response = await fetch(`${BACKEND_URL}/admin/users/validate-issueing/${bookID}/${userID}`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
        });
        const data = await response.json();
        if (response.ok){
            if(data) alert('Book already issued!');
            return !data;
        }
        else {
            alert(data.message);
            return false;
        }
    } catch (err) {
        console.error(err);
    }
}
export async function postIssueBook(issueSchema) {
    try {
        const token = sessionStorage.getItem("authToken");
        const response = await fetch(`${BACKEND_URL}/admin/booking`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(issueSchema),
        });
        const data = await response.json();
        alert(data.message);
        if (response.ok) return true;
        else return false;
    } catch (err) {
        console.error(err);
    }
}


// Issued Book Calls
export async function getIssuedBooks() {
    try {
        const token = sessionStorage.getItem("authToken");
        const fetchWithAuth = async (url) => {
            const response = await fetch(url, {
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch from ${url}: ${response.statusText}`);
            }
            return await response.json();
        };

        const [issuedBooks, prevIssuedBooks, categoryList, genreList] = await Promise.all([
            fetchWithAuth(`${BACKEND_URL}/admin/issued-books`),
            fetchWithAuth(`${BACKEND_URL}/admin/prev-issued-books`),
            fetchWithAuth(`${BACKEND_URL}/admin/category`),
            fetchWithAuth(`${BACKEND_URL}/admin/genre`),
        ]);

        return { issuedBooks, prevIssuedBooks, categoryList, genreList };        
    } catch (err) {
        console.error(err);
        throw err;
    }
}
export async function putAddPayment(paymentData) {
    try {
        const token = sessionStorage.getItem("authToken");
        const response = await fetch(`${BACKEND_URL}/admin/issued-books`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(paymentData),
        });
        const data = await response.json();
        alert(data.message);
        if (response.ok) return true;
        else return false;
    } catch (err) {
        console.error(err);
    }
}
export async function postReturnBook(returnData) {
    try {
        const token = sessionStorage.getItem("authToken");
        const response = await fetch(`${BACKEND_URL}/admin/issued-books`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(returnData),
        });
        const data = await response.json();
        alert(data.message);
        if (response.ok) return true;
        else return false;
    } catch (err) {
        console.error(err);
    }
}


// Report Calls
export async function getReportList(selectedItem, stDateValue, edDateValue, isUserPhase) {
    try {
        const finalRoute = isUserPhase ? 'admin/report/users' : 'admin/report/books';
        const token = sessionStorage.getItem("authToken");
        const response = await fetch(`${BACKEND_URL}/${finalRoute}/${selectedItem}/${stDateValue}/${edDateValue}`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
        });
        const data = await response.json();
        if (response.ok) return data;
        else alert(data.message)
    } catch (err) {
        console.error(err);
    }
}
export async function getUserListForReport(userName, searchBy) {
    try {
        const token = sessionStorage.getItem("authToken");
        const response = await fetch(`${BACKEND_URL}/admin/report/data/users/${userName}/${searchBy}`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
        });
        const data = await response.json();
        if (response.ok) return data;
        else alert(data.message)
    } catch (err) {
        console.error(err);
    }
}
export async function getBookListForReport(bookTitle) {
    try {
        const token = sessionStorage.getItem("authToken");
        const response = await fetch(`${BACKEND_URL}/admin/report/data/books/${bookTitle}`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
        });
        const data = await response.json();
        if (response.ok) return data;
        else alert(data.message)
    } catch (err) {
        console.error(err);
    }
}


// Dashboard Calls
export async function getDashboardData() {
    try {
        const token = sessionStorage.getItem("authToken");
        const fetchWithAuth = async (url) => {
            const response = await fetch(url, {
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch from ${url}: ${response.statusText}`);
            }
            return await response.json();
        };

        const [issuedBooks, dashboardData] = await Promise.all([
            fetchWithAuth(`${BACKEND_URL}/admin/dashboard`),
            fetchWithAuth(`${BACKEND_URL}/admin/dashboard/analytics`),
        ]);

        return { issuedBooks, dashboardData };        
    } catch (err) {
        console.error(err);
        throw err;
    }
}


// Common Fns
export function handleCalculateDateDifference(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDifference = end - start;
    const dayDifference = timeDifference / (1000 * 60 * 60 * 24);

    return Math.round(dayDifference);
}
