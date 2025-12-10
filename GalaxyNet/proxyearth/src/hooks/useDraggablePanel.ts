import { useState, useEffect, useRef, useCallback } from 'react';

export type PanelPosition = 'minimized' | 'half' | 'full';

interface UseDraggablePanelProps {
    onPositionChange?: (position: PanelPosition) => void;
}

const DRAG_THRESHOLD = 10;

export function useDraggablePanel({ onPositionChange }: UseDraggablePanelProps = {}) {
    const [position, setPosition] = useState<PanelPosition>('half');
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState(0);
    const startY = useRef(0);
    const currentTranslate = useRef(0);
    const hasMoved = useRef(false);

    const snapPositions = {
        minimized: typeof window !== 'undefined' ? window.innerHeight * 0.80 : 0,
        half: typeof window !== 'undefined' ? window.innerHeight * 0.45 : 0,
        full: 0
    };

    const getSnapPosition = useCallback((translateY: number): PanelPosition => {
        const positions = [
            { name: 'full' as PanelPosition, value: snapPositions.full },
            { name: 'half' as PanelPosition, value: snapPositions.half },
            { name: 'minimized' as PanelPosition, value: snapPositions.minimized }
        ];

        let closest = positions[0];
        let minDiff = Math.abs(translateY - positions[0].value);

        positions.forEach(pos => {
            const diff = Math.abs(translateY - pos.value);
            if (diff < minDiff) {
                minDiff = diff;
                closest = pos;
            }
        });

        return closest.name;
    }, [snapPositions.full, snapPositions.half, snapPositions.minimized]);

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        startY.current = e.touches[0].clientY;
        currentTranslate.current = snapPositions[position];
        hasMoved.current = false;
    }, [position, snapPositions]);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        startY.current = e.clientY;
        currentTranslate.current = snapPositions[position];
        hasMoved.current = false;
        setIsDragging(true);
    }, [position, snapPositions]);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        const currentY = e.touches[0].clientY;
        const diff = currentY - startY.current;

        if (Math.abs(diff) > DRAG_THRESHOLD) {
            if (!hasMoved.current) {
                hasMoved.current = true;
                setIsDragging(true);
            }
        }

        if (hasMoved.current) {
            const newTranslate = Math.max(0, Math.min(currentTranslate.current + diff, snapPositions.minimized));
            setDragOffset(newTranslate);
        }
    }, [snapPositions.minimized]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging) return;

        const currentY = e.clientY;
        const diff = currentY - startY.current;

        if (Math.abs(diff) > DRAG_THRESHOLD) {
            hasMoved.current = true;
        }

        if (hasMoved.current) {
            const newTranslate = Math.max(0, Math.min(currentTranslate.current + diff, snapPositions.minimized));
            setDragOffset(newTranslate);
        }
    }, [isDragging, snapPositions.minimized]);

    const handleEnd = useCallback(() => {
        if (!isDragging && !hasMoved.current) return;

        setIsDragging(false);

        if (hasMoved.current) {
            const newPosition = getSnapPosition(dragOffset);
            setPosition(newPosition);
            setDragOffset(0);

            if (onPositionChange) {
                onPositionChange(newPosition);
            }
        }

        hasMoved.current = false;
    }, [isDragging, dragOffset, getSnapPosition, onPositionChange]);

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleEnd);

            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleEnd);
            };
        }
    }, [isDragging, handleMouseMove, handleEnd]);

    const getTranslateY = useCallback(() => {
        if (isDragging && hasMoved.current) {
            return dragOffset;
        }
        return snapPositions[position];
    }, [isDragging, dragOffset, position, snapPositions]);

    const setPositionManually = useCallback((newPosition: PanelPosition) => {
        setPosition(newPosition);
        if (onPositionChange) {
            onPositionChange(newPosition);
        }
    }, [onPositionChange]);

    return {
        position,
        setPosition: setPositionManually,
        isDragging,
        translateY: getTranslateY(),
        handlers: {
            onTouchStart: handleTouchStart,
            onMouseDown: handleMouseDown,
            onTouchMove: handleTouchMove,
            onTouchEnd: handleEnd,
        }
    };
}
