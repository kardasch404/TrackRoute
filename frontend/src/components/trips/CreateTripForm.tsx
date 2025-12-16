import { useTripCreation, TripCreationProvider } from '../../features/trips/TripCreationContext';
import { useTripMutations } from '../../hooks/useTripMutations';
import { useAvailableDrivers, useAvailableTrucks, useAvailableTrailers } from '../../hooks/useTrips';

// Step indicator component
function StepIndicator({ currentStep }: { currentStep: number }) {
  const steps = [
    { num: 1, label: 'Route Details' },
    { num: 2, label: 'Cargo Details' },
    { num: 3, label: 'Assignment' },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
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
                className={`w-24 h-1 mx-2 ${
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

  const updateOrigin = (field: string, value: string) => {
    dispatch({
      type: 'UPDATE_ROUTE',
      payload: { origin: { ...route.origin, [field]: value } },
    });
  };

  const updateDestination = (field: string, value: string) => {
    dispatch({
      type: 'UPDATE_ROUTE',
      payload: { destination: { ...route.destination, [field]: value } },
    });
  };

  return (
    <div className="space-y-6">
      {/* Origin */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Origin</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
            <input
              type="text"
              value={route.origin.address}
              onChange={(e) => updateOrigin('address', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md ${errors['origin.address'] ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Street address"
            />
            {errors['origin.address'] && <p className="text-red-500 text-sm mt-1">{errors['origin.address']}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
            <input
              type="text"
              value={route.origin.city}
              onChange={(e) => updateOrigin('city', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md ${errors['origin.city'] ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="City"
            />
            {errors['origin.city'] && <p className="text-red-500 text-sm mt-1">{errors['origin.city']}</p>}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <input
              type="text"
              value={route.origin.country}
              onChange={(e) => updateOrigin('country', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Country"
            />
          </div>
        </div>
      </div>

      {/* Destination */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Destination</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
            <input
              type="text"
              value={route.destination.address}
              onChange={(e) => updateDestination('address', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md ${errors['destination.address'] ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Street address"
            />
            {errors['destination.address'] && <p className="text-red-500 text-sm mt-1">{errors['destination.address']}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
            <input
              type="text"
              value={route.destination.city}
              onChange={(e) => updateDestination('city', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md ${errors['destination.city'] ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="City"
            />
            {errors['destination.city'] && <p className="text-red-500 text-sm mt-1">{errors['destination.city']}</p>}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <input
              type="text"
              value={route.destination.country}
              onChange={(e) => updateDestination('country', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Country"
            />
          </div>
        </div>
      </div>

      {/* Trip Details */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Trip Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Distance (km) *</label>
            <input
              type="number"
              value={route.distance || ''}
              onChange={(e) => dispatch({ type: 'UPDATE_ROUTE', payload: { distance: Number(e.target.value) } })}
              className={`w-full px-3 py-2 border rounded-md ${errors['distance'] ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="0"
              min="0"
            />
            {errors['distance'] && <p className="text-red-500 text-sm mt-1">{errors['distance']}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Est. Duration (hours)</label>
            <input
              type="number"
              value={route.estimatedDuration || ''}
              onChange={(e) => dispatch({ type: 'UPDATE_ROUTE', payload: { estimatedDuration: Number(e.target.value) } })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="0"
              min="0"
              step="0.5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date *</label>
            <input
              type="date"
              value={route.scheduledDate}
              onChange={(e) => dispatch({ type: 'UPDATE_ROUTE', payload: { scheduledDate: e.target.value } })}
              className={`w-full px-3 py-2 border rounded-md ${errors['scheduledDate'] ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors['scheduledDate'] && <p className="text-red-500 text-sm mt-1">{errors['scheduledDate']}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 2: Cargo Details
function CargoDetailsStep() {
  const { state, dispatch } = useTripCreation();
  const { cargo, errors } = state;

  const updateCargo = (field: string, value: string | number) => {
    dispatch({ type: 'UPDATE_CARGO', payload: { [field]: value } });
  };

  const cargoTypes = ['General', 'Refrigerated', 'Hazardous', 'Fragile', 'Bulk', 'Livestock', 'Other'];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Cargo Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              value={cargo.description}
              onChange={(e) => updateCargo('description', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md ${errors['description'] ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Describe the cargo..."
              rows={3}
            />
            {errors['description'] && <p className="text-red-500 text-sm mt-1">{errors['description']}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg) *</label>
            <input
              type="number"
              value={cargo.weight || ''}
              onChange={(e) => updateCargo('weight', Number(e.target.value))}
              className={`w-full px-3 py-2 border rounded-md ${errors['weight'] ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="0"
              min="0"
            />
            {errors['weight'] && <p className="text-red-500 text-sm mt-1">{errors['weight']}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
            <select
              value={cargo.type}
              onChange={(e) => updateCargo('type', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md ${errors['type'] ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select cargo type</option>
              {cargoTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors['type'] && <p className="text-red-500 text-sm mt-1">{errors['type']}</p>}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
            <textarea
              value={cargo.notes || ''}
              onChange={(e) => updateCargo('notes', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Any special instructions or notes..."
              rows={2}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 3: Assignment
function AssignmentStep() {
  const { state, dispatch } = useTripCreation();
  const { assignment } = state;

  const { data: drivers, isLoading: loadingDrivers } = useAvailableDrivers();
  const { data: trucks, isLoading: loadingTrucks } = useAvailableTrucks();
  const { data: trailers, isLoading: loadingTrailers } = useAvailableTrailers();

  const updateAssignment = (field: string, value: string) => {
    dispatch({ type: 'UPDATE_ASSIGNMENT', payload: { [field]: value || undefined } });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Assignment (Optional)</h3>
        <p className="text-sm text-gray-500 mb-4">
          You can assign a driver, truck, and trailer now or do it later.
        </p>
        
        <div className="grid grid-cols-1 gap-4">
          {/* Driver Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Driver</label>
            <select
              value={assignment.driverId || ''}
              onChange={(e) => updateAssignment('driverId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              disabled={loadingDrivers}
            >
              <option value="">Select driver (optional)</option>
              {drivers?.map((driver: { _id: string; firstName: string; lastName: string; email: string }) => (
                <option key={driver._id} value={driver._id}>
                  {driver.firstName} {driver.lastName} - {driver.email}
                </option>
              ))}
            </select>
          </div>

          {/* Truck Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Truck</label>
            <select
              value={assignment.truckId || ''}
              onChange={(e) => updateAssignment('truckId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              disabled={loadingTrucks}
            >
              <option value="">Select truck (optional)</option>
              {trucks?.map((truck: { _id: string; registration: string; brand: string; model: string }) => (
                <option key={truck._id} value={truck._id}>
                  {truck.registration} - {truck.brand} {truck.model}
                </option>
              ))}
            </select>
          </div>

          {/* Trailer Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trailer</label>
            <select
              value={assignment.trailerId || ''}
              onChange={(e) => updateAssignment('trailerId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              disabled={loadingTrailers}
            >
              <option value="">Select trailer (optional)</option>
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
          If you assign a driver, truck, and trailer, the trip status will be set to "Assigned".
          Otherwise, it will remain "Pending" until assignment.
        </p>
      </div>
    </div>
  );
}

// Main Form Component
function CreateTripFormContent({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const { state, dispatch, getFormData, validateStep } = useTripCreation();
  const { createTrip } = useTripMutations();

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
    
    try {
      await createTrip.mutateAsync(getFormData());
      dispatch({ type: 'RESET_FORM' });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to create trip:', error);
    } finally {
      dispatch({ type: 'SET_SUBMITTING', payload: false });
    }
  };

  const renderStep = () => {
    switch (state.currentStep) {
      case 1:
        return <RouteDetailsStep />;
      case 2:
        return <CargoDetailsStep />;
      case 3:
        return <AssignmentStep />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <StepIndicator currentStep={state.currentStep} />
      
      <div className="min-h-[400px]">
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
