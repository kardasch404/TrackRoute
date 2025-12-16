import React from 'react';
import { useTripCreation, TripCreationProvider } from '../../features/trips/TripCreationContext';
import { useTripMutations } from '../../hooks/useTripMutations';
import { useAvailableDrivers, useAvailableTrucks, useAvailableTrailers } from '../../hooks/useTrips';

// Step indicator component
function StepIndicator({ currentStep }: { currentStep: number }) {
  const steps = [
    { num: 1, label: 'Route Details' },
    { num: 2, label: 'Assignment' },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <div key={step.num} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step.num < currentStep
                    ? 'bg-green-500 text-white'
                    : step.num === currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step.num < currentStep ? (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.num
                )}
              </div>
              <span className="mt-2 text-xs font-medium text-gray-600">{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-32 h-1 mx-4 ${
                  step.num < currentStep ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Step 1: Route Details
function RouteDetailsStep() {
  const { state, dispatch } = useTripCreation();
  const { route, errors } = state;

  return (
    <div className="space-y-6">
      {/* Origin */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Origin *</label>
        <input
          type="text"
          value={route.origin}
          onChange={(e) => dispatch({ type: 'UPDATE_ROUTE', payload: { origin: e.target.value } })}
          className={`w-full px-3 py-2 border rounded-md ${errors['origin'] ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="e.g., Bucharest, Romania"
        />
        {errors['origin'] && <p className="text-red-500 text-sm mt-1">{errors['origin']}</p>}
      </div>

      {/* Destination */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Destination *</label>
        <input
          type="text"
          value={route.destination}
          onChange={(e) => dispatch({ type: 'UPDATE_ROUTE', payload: { destination: e.target.value } })}
          className={`w-full px-3 py-2 border rounded-md ${errors['destination'] ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="e.g., Sofia, Bulgaria"
        />
        {errors['destination'] && <p className="text-red-500 text-sm mt-1">{errors['destination']}</p>}
      </div>

      {/* Distance */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Distance (km) *</label>
        <input
          type="number"
          value={route.distance || ''}
          onChange={(e) => dispatch({ type: 'UPDATE_ROUTE', payload: { distance: Number(e.target.value) } })}
          className={`w-full px-3 py-2 border rounded-md ${errors['distance'] ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="0"
          min="1"
        />
        {errors['distance'] && <p className="text-red-500 text-sm mt-1">{errors['distance']}</p>}
      </div>
    </div>
  );
}

// Step 2: Assignment
function AssignmentStep() {
  const { state, dispatch } = useTripCreation();
  const { assignment, errors } = state;

  const { data: drivers, isLoading: loadingDrivers, isError: driversError } = useAvailableDrivers();
  const { data: trucks, isLoading: loadingTrucks, isError: trucksError } = useAvailableTrucks();
  const { data: trailers, isLoading: loadingTrailers, isError: trailersError } = useAvailableTrailers();

  // Find selected truck to show currentKm
  const selectedTruck = trucks?.find((t: { _id: string }) => t._id === assignment.truckId);

  const updateAssignment = (field: string, value: string) => {
    dispatch({ type: 'UPDATE_ASSIGNMENT', payload: { [field]: value || undefined } });
  };

  const hasError = driversError || trucksError || trailersError;
  const isLoading = loadingDrivers || loadingTrucks || loadingTrailers;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Assignment</h3>
        <p className="text-sm text-gray-500 mb-4">
          Assign a driver and truck to this trip. Trailer is optional.
        </p>

        {/* Error state */}
        {hasError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="font-medium text-red-800">Failed to load resources</h4>
                <p className="text-sm text-red-700 mt-1">Unable to fetch available drivers, trucks, or trailers. Please try again later.</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading state */}
        {isLoading && !hasError && (
          <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <svg className="animate-spin h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-gray-600">Loading available resources...</span>
            </div>
          </div>
        )}

        {/* Warning if no resources available */}
        {!isLoading && !hasError && (drivers?.length === 0 || trucks?.length === 0) && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h4 className="font-medium text-yellow-800">Limited Availability</h4>
                <ul className="text-sm text-yellow-700 mt-1">
                  {drivers?.length === 0 && <li>• No drivers available (all have active trips)</li>}
                  {trucks?.length === 0 && <li>• No trucks available (all have active trips)</li>}
                </ul>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 gap-4">
          {/* Driver Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Driver *</label>
            <select
              value={assignment.driverId || ''}
              onChange={(e) => updateAssignment('driverId', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md ${errors['driverId'] ? 'border-red-500' : 'border-gray-300'} ${(isLoading || hasError || drivers?.length === 0) ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              disabled={isLoading || hasError || drivers?.length === 0}
            >
              <option value="">
                {loadingDrivers ? 'Loading drivers...' : driversError ? 'Error loading drivers' : drivers?.length === 0 ? 'No drivers available' : 'Select driver'}
              </option>
              {drivers?.map((driver: { _id: string; firstName: string; lastName: string; email: string }) => (
                <option key={driver._id} value={driver._id}>
                  {driver.firstName} {driver.lastName} - {driver.email}
                </option>
              ))}
            </select>
            {errors['driverId'] && <p className="text-red-500 text-sm mt-1">{errors['driverId']}</p>}
            {!loadingDrivers && drivers?.length === 0 && !driversError && (
              <p className="text-yellow-600 text-sm mt-1">All approved drivers have active trips assigned.</p>
            )}
          </div>

          {/* Truck Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Truck *</label>
            <select
              value={assignment.truckId || ''}
              onChange={(e) => updateAssignment('truckId', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md ${errors['truckId'] ? 'border-red-500' : 'border-gray-300'} ${(isLoading || hasError || trucks?.length === 0) ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              disabled={isLoading || hasError || trucks?.length === 0}
            >
              <option value="">
                {loadingTrucks ? 'Loading trucks...' : trucksError ? 'Error loading trucks' : trucks?.length === 0 ? 'No trucks available' : 'Select truck'}
              </option>
              {trucks?.map((truck: { _id: string; registration: string; brand: string; model: string; currentKm?: number }) => (
                <option key={truck._id} value={truck._id}>
                  {truck.registration} - {truck.brand} {truck.model} ({truck.currentKm?.toLocaleString() || 0} km)
                </option>
              ))}
            </select>
            {errors['truckId'] && <p className="text-red-500 text-sm mt-1">{errors['truckId']}</p>}
            {!loadingTrucks && trucks?.length === 0 && !trucksError && (
              <p className="text-yellow-600 text-sm mt-1">All available trucks have active trips assigned.</p>
            )}
            {selectedTruck && (
              <p className="text-sm text-gray-500 mt-1">
                Current odometer: <span className="font-medium">{selectedTruck.currentKm?.toLocaleString() || 0} km</span>
              </p>
            )}
          </div>

          {/* Trailer Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trailer</label>
            <select
              value={assignment.trailerId || ''}
              onChange={(e) => updateAssignment('trailerId', e.target.value)}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md ${(loadingTrailers || trailersError) ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              disabled={loadingTrailers || trailersError}
            >
              <option value="">
                {loadingTrailers ? 'Loading trailers...' : trailersError ? 'Error loading trailers' : trailers?.length === 0 ? 'No trailers available (optional)' : 'Select trailer (optional)'}
              </option>
              {trailers?.map((trailer: { _id: string; registration: string; type: string }) => (
                <option key={trailer._id} value={trailer._id}>
                  {trailer.registration} - {trailer.type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">Note</h4>
        <p className="text-sm text-blue-700">
          Driver and truck are required to create a trip. The trip will start with the truck's current odometer reading.
        </p>
      </div>
    </div>
  );
}

// Main Form Component
function CreateTripFormContent({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const { state, dispatch, getFormData, validateStep } = useTripCreation();
  const { createTrip } = useTripMutations();
  const { data: trucks } = useAvailableTrucks();
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const handleNext = () => {
    if (validateStep(state.currentStep)) {
      dispatch({ type: 'NEXT_STEP' });
    }
  };

  const handlePrev = () => {
    dispatch({ type: 'PREV_STEP' });
  };

  const handleSubmit = async () => {
    if (!validateStep(state.currentStep)) return;
    
    dispatch({ type: 'SET_SUBMITTING', payload: true });
    setSubmitError(null);
    
    try {
      const formData = getFormData();
      
      // Get the selected truck's currentKm
      const selectedTruck = trucks?.find((t: { _id: string; currentKm?: number }) => t._id === formData.assignment.truckId);
      const startKm = selectedTruck?.currentKm || 0;
      
      await createTrip.mutateAsync({ ...formData, startKm });
      dispatch({ type: 'RESET_FORM' });
      onSuccess();
      onClose();
    } catch (error: unknown) {
      // Extract error message from API response
      const apiError = error as { response?: { data?: { message?: string } } };
      const message = apiError?.response?.data?.message || 'Failed to create trip. Please try again.';
      setSubmitError(message);
    } finally {
      dispatch({ type: 'SET_SUBMITTING', payload: false });
    }
  };

  const renderStep = () => {
    switch (state.currentStep) {
      case 1:
        return <RouteDetailsStep />;
      case 2:
        return <AssignmentStep />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <StepIndicator currentStep={state.currentStep} />
      
      {/* Error Alert */}
      {submitError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-medium text-red-800">Error</h4>
            <p className="text-sm text-red-700">{submitError}</p>
          </div>
          <button 
            onClick={() => setSubmitError(null)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      
      <div className="min-h-[300px]">
        {renderStep()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8 pt-4 border-t">
        <button
          type="button"
          onClick={state.currentStep === 1 ? onClose : handlePrev}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          {state.currentStep === 1 ? 'Cancel' : 'Previous'}
        </button>
        
        {state.currentStep < state.totalSteps ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={state.isSubmitting}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {state.isSubmitting ? 'Creating...' : 'Create Trip'}
          </button>
        )}
      </div>
    </div>
  );
}

// Wrapped with Provider
export default function CreateTripForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  return (
    <TripCreationProvider>
      <CreateTripFormContent onClose={onClose} onSuccess={onSuccess} />
    </TripCreationProvider>
  );
}
