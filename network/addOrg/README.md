# Add a new organtion

### Steps:

-   Create the certs for new organization via running docker-compose and ./create-certificate-with-ca.sh file 
-   Print Org3 into a json file 
-   Fetch config_block.pg and decode it then update with org3 info. 
-   Create file org3_update_in_envelope.pb at the end 
-   Sign the  org3_update_in_envelope.pb with 1st Org peer
-   Update   org3_update_in_envelope.pb via 2nd Org peer
-   Start the docker-services of new organization
-   Fetch the mychannel.block 
-   Make new peer join the mychannel via mychannel.block
-   Install the chaincode, Approve and commit it 