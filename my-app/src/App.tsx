import { styled } from 'styled-components';
import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';

function App() {
    const [search, setSearch] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isWindow, setIsWindow] = useState(false);

    const apiUrl = 'http://localhost:4000/sick';

    useEffect(() => {
        if (search.trim() === '') {
            sessionStorage.removeItem(`searchResult_${search}`);
            setSuggestions([]);
            return;
        }

        const cachedResult = sessionStorage.getItem(`searchResult_${search}`);
        if (cachedResult) {
            setSuggestions(JSON.parse(cachedResult));
        } else {
            axios
                .get(`${apiUrl}?q=${search}`)
                .then((response) => {
                    console.info('calling api');
                    const filteredData = response.data.filter((item: any) => item.sickNm.startsWith(search));
                    setSuggestions(filteredData);
                    sessionStorage.setItem(`searchResult_${search}`, JSON.stringify(filteredData));
                })
                .catch((error) => {
                    console.error('API 요청 오류:', error);
                });
        }
    }, [search]);

    return (
        <Wrap>
            <div>국내 모든 임상시험 검색하고</div>
            <div>온라인으로 참여하기</div>
            <InputWrap>
                <input
                    type="text"
                    onChange={(e: any) => {
                        setSearch(e.target.value);
                    }}
                    placeholder="질환명을 입력해 주세요."
                    onFocus={() => {
                        setIsWindow(true);
                    }}
                    onBlur={() => {
                        setIsWindow(false);
                    }}
                />

                {isWindow ? (
                    <Window>
                        <ul>
                            <div>추천 검색어</div>
                            {suggestions.map((suggestion: any, index: number) => (
                                <li key={index}>{suggestion.sickNm}</li>
                            ))}
                        </ul>
                    </Window>
                ) : (
                    <></>
                )}
            </InputWrap>
        </Wrap>
    );
}

const Wrap = styled.div`
    background-color: #cae9ff;
    text-align: center;
    font-size: 1.25rem;
    font-weight: 700;
    line-height: 1.6;
    padding: 200px 0;
    position: relative;
`;
const InputWrap = styled.div`
    input {
        width: 430px;
    }

    ul {
        list-style: none;
        padding: 0;
    }

    li {
        line-height: 3;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;

const Window = styled.div`
    text-align: left;
    width: 380px;
    height: 500px;
    background-color: white;
    border-radius: 20px;
    margin: auto;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    position: absolute;
    top: 60%;
    left: 50%;
    transform: translateX(-50%);
    font-size: 1rem;
    padding: 30px;
    overflow: hidden;
`;

export default App;
