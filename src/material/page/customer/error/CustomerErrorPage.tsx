import React from 'react';
import {AssetPath} from "../../../config/router";

interface Props {
    location: any;
    history: any;
}

const CustomerErrorPage: React.FC<Props> = ({location, history}) => {

    return (
        <div className={"p-d-flex p-flex-column p-ai-center p-jc-center p-p-3 p-page-error"}>
            <img src={AssetPath.errorPageImg} alt={"page-not-found"} width={500}/>
            {
                location.state && location.state.hasOwnProperty("content") && (
                    <h2 className={"p-mt-3"}>{location.state.content}</h2>
                )
            }
        </div>
    );
};

export default CustomerErrorPage;
