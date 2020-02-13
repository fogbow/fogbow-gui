export const getAllocations = (providerId, cloudNames, dispatch, resourceProvider, actionTypes) => {
    return new Promise((resolve, reject) => {
        const { request, success, failure } = actionTypes;

        dispatch(request());

        try {
            let promises = cloudNames.map(async(cloudName) => {
                try {
                    let response = await resourceProvider.getAllocation(providerId, cloudName);
                    let allocation = response.data;
                    return {
                        ... allocation,
                        cloudName
                    };
                } catch (error) {
                    console.log(error);
                    throw error;
                }
            });

            Promise.all(promises).then(result => {
                const allocations = {};
                result.forEach(allocation => {
                    allocations[allocation.cloudName] = {};
                    Object.assign(allocations[allocation.cloudName], allocation);
                    delete allocations[allocation.cloudName].cloudName;
                })

                resolve(dispatch(success(allocations)));
            })
        } catch (error) {
            // const message = getErrorMessage(error);
            // toast.error(messages.images.get.concat(message));
            reject(dispatch(failure(error)));
        }
    });
};