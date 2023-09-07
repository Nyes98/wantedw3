import { styled } from 'styled-components';
import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';

function App() {
    const [search, setSearch] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isWindow, setIsWindow] = useState(false);
    const [resultIndex, setResultIndex] = useState(-1);
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
            <InputWrap className={isWindow ? 'focus' : ''}>
                <input
                    type="text"
                    value={search}
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
                    onKeyDown={(e: any) => {
                        if (e.keyCode === 38) {
                            if (resultIndex === -1) return;
                            setResultIndex((prev) => prev - 1);
                            console.log('도나', resultIndex);
                        }
                        if (e.keyCode === 40) {
                            if (resultIndex === suggestions.length - 1) return;

                            setResultIndex((prev) => prev + 1);
                        }
                    }}
                />
                {search.length > 0 ? (
                    <CancleBtn
                        onClick={() => {
                            setSearch('');
                        }}
                    >
                        x
                    </CancleBtn>
                ) : (
                    <CancleBtn></CancleBtn>
                )}
                <SearchBtn>
                    <img src="/imgs/search.svg" alt="search" />
                </SearchBtn>

                {isWindow ? (
                    <Window>
                        <ul>
                            <div>추천 검색어</div>
                            {suggestions.map((suggestion: any, index: number) => (
                                <li
                                    key={index}
                                    onMouseEnter={(e: any) => {
                                        setResultIndex(index);
                                    }}
                                    onMouseLeave={() => {
                                        setResultIndex(-1);
                                    }}
                                    className={index === resultIndex ? 'on' : ''}
                                >
                                    <img src="/imgs/search.svg" alt="search" />
                                    {suggestion.sickNm}
                                </li>
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
    padding: 100px 0;
    position: relative;
`;

const CancleBtn = styled.div`
    width: 20px;
    cursor: pointer;
`;

const SearchBtn = styled.div`
    display: flex;
    justify-content: center;
    background-color: #007be9;
    cursor: pointer;
    width: 48px;
    height: 48px;
    border-radius: 24px;
`;
const InputWrap = styled.div`
    margin: 50px auto;
    display: flex;
    width: 370px;
    padding: 20px 30px;
    border-radius: 42px;
    background-color: white;
    justify-content: space-around;

    &.focus {
        border: 2px solid blue;
    }

    .on {
        background-color: lightgray;
    }

    input {
        width: 300px;
        border: none;
    }

    input:focus {
        outline: none;
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
    img {
        width: 13px;
        filter: invert(100%) sepia(0%) saturate(7500%) hue-rotate(226deg) brightness(102%) contrast(101%);
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
    top: 67%;
    left: 50%;
    transform: translateX(-50%);
    font-size: 1rem;
    padding: 5px 30px;
    overflow: hidden;

    div {
        font-size: 0.8rem;
        color: lightgray;
    }

    img {
        width: 13px;
        margin-right: 5px;
    }
`;

export default App;
