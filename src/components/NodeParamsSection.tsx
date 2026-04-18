import { InputAdornment, Typography } from '@mui/material';
import { PanelSection } from './MuiWrappers.tsx';
import { Vec3Input } from './inputs/Vec3Input.tsx';
import {
    type CurveNode3,
    setNodePosition3,
    setCollinearTangentEnd3,
    getTangentPitch3,
    setCollinearTangentPitch3
} from '../geometry/curveNode.ts';
import { CustomInput } from './inputs/CustomInput.tsx';

interface NodeParamsSectionProps {
    node?: CurveNode3;
    setNode?: (node: CurveNode3) => void;
}

export function NodeParamsSection({ node, setNode }: NodeParamsSectionProps) {
    return (
        <PanelSection>
            <Typography variant='h6'>Selected Node</Typography>

            {node && setNode ? (
                <>
                    <Vec3Input
                        label='Node Position'
                        value={node.position}
                        setValue={v => setNode(setNodePosition3(node, v))}
                    />

                    <Vec3Input
                        label='Tangent 1 End'
                        value={node.tangentEnd1}
                        setValue={v => setNode(setCollinearTangentEnd3(node, 'tangentEnd1', v))}
                    />

                    <Vec3Input
                        label='Tangent 2 End'
                        value={node.tangentEnd2}
                        setValue={v => setNode(setCollinearTangentEnd3(node, 'tangentEnd2', v))}
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
                        onChange={(e) => setNode(setCollinearTangentPitch3(node, Number(e.target.value)))}
                    />
                </>
            ) : (
                <Typography variant='body2'>No node selected</Typography>
            )}
        </PanelSection>
    )
}