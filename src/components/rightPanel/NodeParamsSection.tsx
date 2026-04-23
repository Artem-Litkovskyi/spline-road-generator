import { InputAdornment, Typography } from '@mui/material';

import { PanelSection } from '../MuiWrappers.tsx';
import { Vec3Input } from '../inputs/Vec3Input.tsx';
import { CustomInput } from '../inputs/CustomInput.tsx';

import { useProjectContext } from '../../hooks/useProjectContext.ts';

import {
    setNodePosition3,
    setCollinearTangentEnd3,
    getTangentPitch3,
    setCollinearTangentPitch3
} from '../../geometry/curveNode.ts';

export function NodeParamsSection() {
    const {
        project: { curveNodes },
        selectedNode,
        setNode,
    } = useProjectContext();

    const node = selectedNode ? curveNodes[selectedNode] : null;

    return (
        <PanelSection>
            <Typography variant='h6'>Selected Node</Typography>

            {selectedNode && node ? (
                <>
                    <Vec3Input
                        label='Node Position'
                        value={node.position}
                        setValue={v => setNode(selectedNode, setNodePosition3(node, v))}
                    />

                    <Vec3Input
                        label='Tangent 1 End'
                        value={node.tangentEnd1}
                        setValue={v => setNode(selectedNode, setCollinearTangentEnd3(node, 'tangentEnd1', v))}
                    />

                    <Vec3Input
                        label='Tangent 2 End'
                        value={node.tangentEnd2}
                        setValue={v => setNode(selectedNode, setCollinearTangentEnd3(node, 'tangentEnd2', v))}
                    />

                    <CustomInput
                        label='Pitch'
                        type='number'
                        placeholder='0'
                        slotProps={{
                            htmlInput: { min: -90, max: 90 },
                            input: {
                                endAdornment: <InputAdornment position='end'>°</InputAdornment>,
                            },
                        }}
                        value={getTangentPitch3(node)}
                        onChange={(e) => {
                            setNode(selectedNode, setCollinearTangentPitch3(node, Number(e.target.value)));
                        }}
                    />
                </>
            ) : (
                <Typography variant='body2'>No node selected</Typography>
            )}
        </PanelSection>
    )
}