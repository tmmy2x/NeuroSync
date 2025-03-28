def should_activate_focus_mode(mood: str, rhythm_phase: str) -> dict:
    score = 0.0
    reasons = []

    # Rhythm Phase Boost
    if rhythm_phase == "deep_work":
        score += 0.5
        reasons.append("User is in deep work phase")
    elif rhythm_phase == "shallow_work":
        score += 0.2
        reasons.append("User is in light work mode")
    elif rhythm_phase == "break":
        score -= 0.3
        reasons.append("User is on a break")

    # Mood Boost
    if mood == "calm":
        score += 0.3
        reasons.append("User is emotionally calm")
    elif mood == "focused":
        score += 0.4
        reasons.append("User is already focused")
    elif mood == "fatigued":
        score -= 0.4
        reasons.append("User is fatigued")

    # Tone-based adjustments could go here later...

    activate = score >= 0.75
    return {
        "should_activate": activate,
        "activation_score": round(score, 2),
        "reason": ", ".join(reasons)
    }
