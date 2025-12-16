import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { RouteDetails, AssignmentDetails, CreateTripFormData } from './tripsTypes';

// Form State
interface TripCreationState {
  currentStep: number;
  totalSteps: number;
  route: RouteDetails;
  assignment: AssignmentDetails;
  isSubmitting: boolean;
  errors: Record<string, string>;
}

// Actions
type TripCreationAction =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'UPDATE_ROUTE'; payload: Partial<RouteDetails> }
  | { type: 'UPDATE_ASSIGNMENT'; payload: Partial<AssignmentDetails> }
  | { type: 'SET_ERRORS'; payload: Record<string, string> }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'RESET_FORM' };

// Initial State
const initialState: TripCreationState = {
  currentStep: 1,
  totalSteps: 2,
  route: {
    origin: '',
    destination: '',
    distance: 0,
  },
  assignment: {
    driverId: '',
    truckId: '',
    trailerId: undefined,
  },
  isSubmitting: false,
  errors: {},
};

// Reducer
function tripCreationReducer(state: TripCreationState, action: TripCreationAction): TripCreationState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: Math.min(Math.max(1, action.payload), state.totalSteps) };
    case 'NEXT_STEP':
      return { ...state, currentStep: Math.min(state.currentStep + 1, state.totalSteps), errors: {} };
    case 'PREV_STEP':
      return { ...state, currentStep: Math.max(state.currentStep - 1, 1), errors: {} };
    case 'UPDATE_ROUTE':
      return { ...state, route: { ...state.route, ...action.payload } };
    case 'UPDATE_ASSIGNMENT':
      return { ...state, assignment: { ...state.assignment, ...action.payload } };
    case 'SET_ERRORS':
      return { ...state, errors: action.payload };
    case 'CLEAR_ERRORS':
      return { ...state, errors: {} };
    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.payload };
    case 'RESET_FORM':
      return initialState;
    default:
      return state;
  }
}

// Context
interface TripCreationContextType {
  state: TripCreationState;
  dispatch: React.Dispatch<TripCreationAction>;
  getFormData: () => CreateTripFormData;
  validateStep: (step: number) => boolean;
}

const TripCreationContext = createContext<TripCreationContextType | null>(null);

// Provider
export function TripCreationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(tripCreationReducer, initialState);

  const getFormData = (): CreateTripFormData => ({
    route: state.route,
    assignment: state.assignment,
  });

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};

    if (step === 1) {
      // Validate Route Details
      if (!state.route.origin) errors['origin'] = 'Origin is required';
      if (!state.route.destination) errors['destination'] = 'Destination is required';
      if (!state.route.distance || state.route.distance <= 0) errors['distance'] = 'Distance must be greater than 0';
    }

    if (step === 2) {
      // Validate Assignment - driver and truck are required
      if (!state.assignment.driverId) errors['driverId'] = 'Driver is required';
      if (!state.assignment.truckId) errors['truckId'] = 'Truck is required';
    }

    if (Object.keys(errors).length > 0) {
      dispatch({ type: 'SET_ERRORS', payload: errors });
      return false;
    }

    dispatch({ type: 'CLEAR_ERRORS' });
    return true;
  };

  return (
    <TripCreationContext.Provider value={{ state, dispatch, getFormData, validateStep }}>
      {children}
    </TripCreationContext.Provider>
  );
}

// Hook
export function useTripCreation() {
  const context = useContext(TripCreationContext);
  if (!context) {
    throw new Error('useTripCreation must be used within a TripCreationProvider');
  }
  return context;
}
