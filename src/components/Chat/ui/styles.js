import styled from 'styled-components';

export const ChatWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
`;

export const Chat = styled.div`
    border-radius: 0px 0px 17px 17px;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
    background: rgb(255, 255, 255);
    width: 380px;
    padding: 4px 12px;
`;

export const ChatHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const ChatNameWrapper = styled.div`
    display: flex;
    align-items: center;
    column-gap: 2px;
    cursor: pointer;
`;

export const ChatNotifyWrapper = styled.div`
    display: flex;
    align-items: center;
    column-gap: 2px;
    cursor: pointer;
`;

export const ChatName = styled.div`
    color: rgb(14, 8, 37);
    font-size: 18px;
    font-weight: 400;
    line-height: 140%;
`;

export const ChatNotify = styled.div`
    color: rgb(111, 95, 121);
    font-size: 10px;
    font-weight: 600;
    line-height: 140%;
`;

export const ChatContent = styled.div`
    width: 340px;
    z-index: 100;
    position: absolute;
    top: 35px;
    left: 20px;
    display: flex;
    flex-direction: column;
    border-radius: 0px 0px 17px 17px;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
`;

export const ChatBg = styled.div`
    display: flex;
    justify-content: center;
    padding: 6px 8px;
    border-radius: 50px;
    background: rgb(207, 170, 229);
`;

export const ChatUserBlock = styled.div`
    background: rgba(87, 170, 228, 0.5);
    display: flex;
    align-items: center;
    justify-self: start;
    padding: 8px;
    column-gap: 5px;
`;

export const ChatMessageBlock = styled.div`
    overflow: auto;
    min-height: 500px;
    max-height: 500px;
    height: max-content;
    padding: 8px 4px;
    background: rgba(255, 255, 255, 0.7);

    &::-webkit-scrollbar {
        width: 5px;
        height: 5px;
    }

    &::-webkit-scrollbar-button {
        display: none;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background: #ccc;
        border-radius: 5px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: #999;
    }

    &::-webkit-scrollbar-corner {
        display: none;
    }

    &::-webkit-resizer {
        display: none;
    }
`;

export const ChatUserMessageWrapper = styled.div`
    display: flex;
    align-items: start;
`;

export const ChatUserMessage = styled.div`
    margin-left: 7px;
    margin-top: 10px;
    padding: 10px 10px 30px;
    background: rgb(223, 239, 250);
    border-radius: 10px;
    align-self: flex-end;
    max-width: 85%;
    overflow-wrap: break-word;
`;

export const ChatTextBlock = styled.div`
    margin-top: auto;
    padding: 14px 12px;
    border-radius: 0px 0px 17px 17px;
    background: rgba(87, 170, 228, 0.7);
    display: flex;
    align-items: center;
    justify-content: space-between;
    column-gap: 5px;
`;

export const Button = styled.button`
    background: none;
    border: none;
    cursor: pointer;
`;

export const ChatInput = styled.input`
    border: 2px solid rgb(111, 95, 121);
    border-radius: 500px;
    padding: 5px 10px;
    background: rgb(255, 255, 255);
    outline: none;
    width: 100%;
    color: rgb(14, 8, 37);
    font-family: 'Duru Sans', sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 140%;

    &:focus {
        border: 2px solid rgb(87, 170, 228);
        box-shadow: inset 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
    }
`;

export const ChatBtnInactive = styled.button`
    cursor: not-allowed;
    opacity: 0.3;
`;
